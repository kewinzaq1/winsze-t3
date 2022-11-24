import bcrypt from "bcrypt";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { registerSchema } from "src/zod/auth";

export const authRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
  register: publicProcedure
    .input(registerSchema)
    .query(async ({ ctx, input }) => {
      const password = await bcrypt.hash(input.password, 10);
      const user = await ctx.prisma.user.create({
        data: {
          email: input.email,
          password: password,
          role: input.role,
        },
      });
      return user;
    }),
});
