import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { CreateUsernameResponse } from "../../../types/myTypes";

export const userRouter = createTRPCRouter({
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
