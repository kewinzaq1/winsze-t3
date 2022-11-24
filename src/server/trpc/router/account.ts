import bcrypt from "bcrypt";
import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const accountRouter = router({
  changePassword: protectedProcedure
    .input(
      z.object({
        currentPassword: z.string(),
        newPassword: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user.email) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User email not found",
        });
      }

      const user = await ctx.prisma.user.findUnique({
        where: { email: ctx.session.user.email },
      });

      if (!user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not found",
        });
      }

      const isValid = await bcrypt.compare(
        input.currentPassword,
        user?.password as string
      );
      if (!isValid) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid password",
        });
      }

      const password = await bcrypt.hash(input.newPassword, 10);
      const updatedUser = await ctx.prisma.user.update({
        where: { email: ctx.session.user.email },
        data: {
          password: password,
        },
      });

      return updatedUser;
    }),
});
