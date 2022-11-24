import { z } from "zod";
import bcrypt from "bcrypt";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { prisma } from "src/server/db/client";

export const authRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(8),
      })
    )
    .query(async ({ ctx, input }) => {
      const password = await bcrypt.hash(input.password, 10);

      const user = await ctx.prisma.user.create({
        data: {
          email: input.email,
          password: password,
        },
      });
      return user;
    }),
});
