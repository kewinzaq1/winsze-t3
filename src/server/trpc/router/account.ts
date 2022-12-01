import bcrypt from "bcrypt";
import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { storageClient } from "src/server/storage/supabase";
import { getUUID } from "src/utils/getUUID";
import { getTypeFromBase64 } from "src/utils/getTypeFromBase64";
import { base64ToBuffer } from "src/utils/base64ToBuffer";

export const accountRouter = router({
  updatePassword: protectedProcedure
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
  updateEmail: protectedProcedure
    .input(
      z.object({
        password: z.string(),
        email: z.string().email(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not found",
        });
      }

      if (ctx.session.user.email === input.email) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "New email is the same as the current email",
        });
      }

      const user = await ctx.prisma.user.findUnique({
        where: { email: ctx.session.user.email as string },
      });
      const isValid = await bcrypt.compare(
        input.password,
        user?.password as string
      );
      if (!isValid) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid password",
        });
      }

      const emailIsUsed = await ctx.prisma.user.findUnique({
        where: { email: input.email },
      });
      if (emailIsUsed) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Email already in use",
        });
      }

      const updatedUser = await ctx.prisma.user.update({
        where: { email: ctx.session.user.email as string },
        data: {
          email: input.email,
        },
      });
      return updatedUser;
    }),
  removeAccount: protectedProcedure
    .input(
      z.object({
        password: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session.user) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User not found",
        });
      }

      const user = await ctx.prisma.user.findUnique({
        where: { email: ctx.session.user.email as string },
      });
      const isValid = await bcrypt.compare(
        input.password,
        user?.password as string
      );
      if (!isValid) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid password",
        });
      }

      const deletedUser = await ctx.prisma.user.delete({
        where: { email: ctx.session.user.email as string },
      });

      return deletedUser;
    }),
  updateAvatar: protectedProcedure
    .input(z.object({ avatar: z.any() }))
    .mutation(async ({ ctx, input }) => {
      console.log(ctx.session.user);

      const user = await ctx.prisma.user.findUnique({
        where: { email: ctx.session.user.email as string },
      });

      if (!input.avatar) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Avatar not found",
        });
      }

      const avatar = base64ToBuffer(input.avatar);

      const fileName = `${user?.id}/${getUUID()}`;
      const { error } = await storageClient
        .from("avatars")
        .upload(fileName, avatar, {
          cacheControl: "3600",
          contentType: getTypeFromBase64(input.avatar),
        });
      if (error) {
        throw error;
      }

      const { data: url } = storageClient
        .from("avatars")
        .getPublicUrl(fileName);

      const updatedUser = await ctx.prisma.user.update({
        where: { email: ctx.session.user.email as string },
        data: {
          image: url.publicUrl,
        },
      });
      return updatedUser;
    }),
  removeAvatar: protectedProcedure.mutation(async ({ ctx }) => {
    if (!ctx.session.user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User not found",
      });
    }

    const user = await ctx.prisma.user.findUnique({
      where: { email: ctx.session.user.email as string },
    });

    await storageClient.from("avatars").remove([user?.image as string]);

    const updatedUser = await ctx.prisma.user.update({
      where: { email: ctx.session.user.email as string },
      data: {
        image: null,
      },
    });

    return updatedUser;
  }),
});
