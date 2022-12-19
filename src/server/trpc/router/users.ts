import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { router, protectedProcedure } from "../trpc";

export const userRouter = router({
  getUser: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { id } = input;
      const user = ctx.prisma.user.findUnique({
        where: {
          id,
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      return user;
    }),
  getUsers: protectedProcedure.query(async ({ ctx }) => {
    const users = await ctx.prisma.user.findMany();

    return users;
  }),
});
