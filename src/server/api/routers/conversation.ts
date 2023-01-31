import { z } from "zod";
import { observable } from "@trpc/server/observable";
import { EventEmitter } from "events";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { CreateUsernameResponse } from "../../../types/myTypes";
import { TRPCError } from "@trpc/server";
import { Conversation, Prisma, User } from "@prisma/client";

// create a global event emitter
const eventEmitter = new EventEmitter();

// Note: don't forget its return type
export const conversationRouter = createTRPCRouter({
  conversations: protectedProcedure.query(async ({ ctx }) => {
    const { prisma, session } = ctx;

    if (!session.user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Not authorized",
      });
    }

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

      if (!session.user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Not authorized",
        });
      }

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
        eventEmitter.emit("add", conversation);

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
    .mutation(async ({ ctx, input }) => {
      const { prisma, session } = ctx;
      const { userId, conversationId } = input;

      if (!session.user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Not authorized",
        });
      }

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

  // deleteConversation
  // Subscriptions
  createConversationSubscription: protectedProcedure.subscription(() => {
    return observable<Conversation>((emit) => {
      const onAdd = (data: Conversation) => {
        emit.next(data);
      };

      eventEmitter.on("add", onAdd);

      return () => {
        eventEmitter.off("add", onAdd);
      };
    });
  }),
});

// include statements
export const participantPopulated =
  Prisma.validator<Prisma.ConversationParticipantInclude>()({
    user: {
      select: {
        id: true,
        username: true,
        image: true,
      },
    },
  });

export const conversationPopulated =
  Prisma.validator<Prisma.ConversationInclude>()({
    participants: {
      include: participantPopulated,
    },
    latestMessage: {
      include: {
        sender: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    },
  });
