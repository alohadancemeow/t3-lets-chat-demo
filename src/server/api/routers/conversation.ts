import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { CreateUsernameResponse } from "../../../types/myTypes";
import { TRPCError } from "@trpc/server";
import { Prisma, User } from "@prisma/client";

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

        return { conversationId: conversation.id };
      } catch (error: any) {
        console.log("create conversation err", error);
        throw new TRPCError(error?.message);
      }
    }),
  // markConversationAsRead
  // deleteConversation
  // Subscription
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