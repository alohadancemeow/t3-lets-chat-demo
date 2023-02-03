import { z } from "zod";
import { observable } from "@trpc/server/observable";
import { EventEmitter } from "events";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import {
  MessagePopulated,
  conversationPopulated,
  messagePopulated,
} from "../../../types/myTypes";
import { TRPCError } from "@trpc/server";

// create a global event emitter
const ee = new EventEmitter();

export const messageRouter = createTRPCRouter({
  messages: protectedProcedure
    .input(
      z.object({
        conversationId: z.string(),
      })
    )
    .query(async ({ ctx, input }): Promise<Array<MessagePopulated>> => {
      const { prisma, session } = ctx;
      const { conversationId } = input;
      const { id: userId } = session.user;

      const conversation = await prisma.conversation.findUnique({
        where: {
          id: conversationId,
        },
        include: conversationPopulated,
      });

      if (!conversation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Conversation not found",
        });
      }

      const allowToView = conversation.participants.some(
        (p) => p.userId === userId
      );

      if (!allowToView) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Not allowed" });
      }

      // Find messages and sort by desc
      try {
        const messages = await prisma.message.findMany({
          where: {
            conversationId,
          },
          include: messagePopulated,
          // orderBy: {
          //   createdAt: "desc",
          // },
        });

        return messages;
      } catch (error: any) {
        console.log("messages error", error);
        throw new TRPCError(error?.message);
      }
    }),
  sendMessage: protectedProcedure
    .input(
      z.object({
        // id: z.string(),
        conversationId: z.string(),
        senderId: z.string(),
        body: z.string(),
      })
    )
    .mutation(async ({ ctx, input }): Promise<boolean> => {
      const { prisma, session } = ctx;
      const {
        // id: messageId,
        conversationId,
        senderId,
        body: messageBody,
      } = input;

      const { id: userId } = session.user;

      if (userId !== senderId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Not authorized",
        });
      }

      try {
        //  create new message
        const newMessage = await prisma.message.create({
          data: {
            // id: messageId,
            senderId,
            conversationId,
            body: messageBody || "...",
          },
          include: messagePopulated,
        });

        // console.log('newMessage', newMessage);
        

        // Find conversatio participant
        const participant = await prisma.conversationParticipant.findFirst({
          where: {
            userId,
            conversationId,
          },
        });

        if (!participant) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Participant does not exist",
          });
        }

        // Update conversation
        const conversation = await prisma.conversation.update({
          where: {
            id: conversationId,
          },
          data: {
            latestMessageId: newMessage.id,
            participants: {
              update: {
                where: {
                  id: participant.id,
                },
                data: {
                  hasSeenLatestMessage: true,
                },
              },
              updateMany: {
                where: {
                  NOT: {
                    userId,
                  },
                },
                data: {
                  hasSeenLatestMessage: false,
                },
              },
            },
          },
          include: conversationPopulated,
        });

        // subscribe
        ee.emit("messageSent", newMessage);
        ee.emit("conversationUpdated", conversation);
      } catch (error: any) {
        console.log("send message err", error);
        throw new TRPCError(error?.message);
      }

      return true;
    }),

  // subscription
  messageSent: publicProcedure.subscription(() => {
    return observable<MessagePopulated>((emit) => {
      const onAdd = (data: MessagePopulated) => emit.next(data);
      ee.on("messageSent", onAdd);
      return () => {
        ee.off("messageSent", onAdd);
      };
    });
  }),
});
