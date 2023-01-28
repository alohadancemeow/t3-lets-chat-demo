import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { CreateUsernameResponse } from "../../../types/myTypes";
import { TRPCError } from "@trpc/server";
import { User } from "@prisma/client";

export const userRouter = createTRPCRouter({
  getAllUsers: protectedProcedure.query(
    async ({ ctx }): Promise<Array<User>> => {
      const { prisma, session } = ctx;

      if (!session.user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Not authorized",
        });
      }

      const { username: myUsername } = session.user;

      // Search username exept me
      try {
        const users = await prisma.user.findMany({
          where: {
            username: {
              not: myUsername,
              mode: "insensitive",
            },
          },
        });

        return users;
      } catch (error: any) {
        console.log("search username error", error);
        throw new TRPCError(error?.message);
      }
    }
  ),
  createUsername: protectedProcedure
    .input(
      z.object({
        username: z.string().max(20, { message: "username too long" }),
      })
    )
    .mutation(async ({ ctx, input }): Promise<CreateUsernameResponse> => {
      const { prisma, session } = ctx;
      const { username } = input;

      if (!session.user) {
        return { error: "Not authorized" };
      }

      const { id: userId } = session.user;

      try {
        // check that username is not taken
        const existing = await prisma.user.findUnique({
          where: {
            username,
          },
        });

        if (existing) {
          return {
            error: "Username already taken, please try another",
          };
        }

        // Update username
        await prisma.user.update({
          where: {
            id: userId,
          },
          data: {
            username,
          },
        });

        return { success: true };
      } catch (error: any) {
        console.log("createUsername error", error);
        return { error: error?.message };
      }
    }),
});
