import bcrypt from "bcrypt";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { registerSchema } from "src/zod/auth";
import { Prisma } from "@prisma/client";

export const authRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
  register: publicProcedure
    .input(registerSchema)
    .mutation(async ({ ctx, input }) => {
      const password = await bcrypt.hash(input.password, 10);
      try {
        const user = await ctx.prisma.user.create({
          data: {
            email: input.email,
            password: password,
            role: input.role,
          },
        });
        return user;
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (e.code === "P2002") {
            throw new Error("Email already in use");
          }
        }
        throw e;
      }
    }),
});
