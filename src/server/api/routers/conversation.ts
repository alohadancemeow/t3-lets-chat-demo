import { z } from "zod";
import { observable } from "@trpc/server/observable";
import { EventEmitter } from "events";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import {
  ConversationPopulated,
  conversationPopulated,
} from "../../../types/myTypes";
import { TRPCError } from "@trpc/server";

// create a global event emitter
const ee = new EventEmitter();

// Note: don't forget its return type
export const conversationRouter = createTRPCRouter({
  conversations: protectedProcedure.query(async ({ ctx }) => {
    const { prisma, session } = ctx;

    const { id } = session.user;

    // Find all conversations that user is part of
    try {
      const conversations = await prisma.conversation.findMany({
        where: {
          participants: {
            some: {
              userId: {
                equals: id,
              },
            },
          },
        },
        include: conversationPopulated,
        orderBy: {
          updatedAt: "desc",
        },
      });

      // Since above query does not work
      // const myConversations = conversations.filter(
      //   (conversation) =>
      //     !!conversation.participants.find((p) => p.userId === id)
      // );
      // console.log("myConversations", myConversations);

      return conversations;
      // return myConversations;
    } catch (error: any) {
      console.log("get conversation err", error);
      throw new TRPCError(error?.message);
    }
  }),

  // Create conversation
  createConversation: protectedProcedure
    .input(
      z.object({
        participantIds: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }): Promise<{ conversationId: string }> => {
      const { prisma, session } = ctx;
      const { participantIds } = input;

      const { id: userId } = session.user;

      // // Create conversation entity
      try {
        const conversation = await prisma.conversation.create({
          data: {
            participants: {
              createMany: {
                data: participantIds.map((id) => ({
                  userId: id,
                  hasSeenLatestMessage: id === userId,
                })),
              },
            },
          },
          include: conversationPopulated,
        });

        // subscribe
        ee.emit("conversationCreated", conversation);

        return { conversationId: conversation.id };
      } catch (error: any) {
        console.log("create conversation err", error);
        throw new TRPCError(error?.message);
      }
    }),

  // markConversationAsRead
  markConversationAsRead: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        conversationId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }): Promise<boolean> => {
      const { prisma, session } = ctx;
      const { userId, conversationId } = input;

      try {
        const participant = await prisma.conversationParticipant.findFirst({
          where: {
            userId,
            conversationId,
          },
        });

        if (!participant) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Participant entity not found",
          });
        }

        await prisma.conversationParticipant.update({
          where: {
            id: participant.id,
          },
          data: {
            hasSeenLatestMessage: true,
          },
        });

        return true;
      } catch (error: any) {
        console.log("markConversationAsRead err", error);
        throw new TRPCError(error?.message);
      }
    }),

  // updateConversation
  updateConversation: protectedProcedure
    .input(
      z.object({
        conversationId: z.string(),
        participantIds: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { conversationId, participantIds } = input;

      const { id: userId } = session.user;

      try {
        // get participant in conversation
        const participants = await prisma.conversationParticipant.findMany({
          where: {
            conversationId,
          },
        });

        // get participant ids
        const existingParticipants = participants.map((p) => p.userId);

        // get participant to delete
        const participantToDelete = existingParticipants.filter(
          (id) => !participantIds.includes(id)
        );

        // get participant to create
        const participantToCreate = participantIds.filter(
          (id) => !existingParticipants.includes(id)
        );

        // transection statements
        const transectionStatements = [
          prisma.conversation.update({
            where: {
              id: conversationId,
            },
            data: {
              participants: {
                deleteMany: {
                  userId: {
                    in: participantToDelete,
                  },
                  conversationId,
                },
              },
            },
            include: conversationPopulated,
          }),
        ];

        // conversation to re-create
        const conversationUpdate = prisma.conversation.update({
          where: {
            id: conversationId,
          },
          data: {
            participants: {
              createMany: {
                data: participantToCreate.map((userId) => ({
                  userId,
                  hasSeenLatestMessage: true,
                })),
              },
            },
          },
          include: conversationPopulated,
        });

        /** Check if users in conversation,
         *  update conversation
         */
        if (participantToCreate.length) {
          transectionStatements.push(conversationUpdate);
        }

        // execute transection statements
        const [update, createOrDelete] = await prisma.$transaction(
          transectionStatements
        );

        // subscribe
        ee.emit("conversationUpdated", [update, createOrDelete]);
        // ee.emit("conversationUpdated", createOrDelete);
      } catch (error: any) {
        console.log("deleteConversatio err", error);
        throw new TRPCError(error?.message);
      }

      return true;
    }),

  // Subscriptions when conversation is created
  conversationCreated: publicProcedure.subscription(() => {
    return observable<ConversationPopulated>((emit) => {
      const onAdd = (data: ConversationPopulated) => emit.next(data);
      ee.on("conversationCreated", onAdd);
      return () => {
        ee.off("conversationCreated", onAdd);
      };
    });
  }),

  // Subscriptions when conversation is updated
  conversationUpdated: publicProcedure.subscription(() => {
    return observable<ConversationPopulated>((emit) => {
      const onAdd = (data: ConversationPopulated) => emit.next(data);
      ee.on("conversationUpdated", onAdd);
      return () => {
        ee.off("conversationUpdated", onAdd);
      };
    });
  }),
});
