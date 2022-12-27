import bcrypt from "bcrypt";
import { router, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { storageClient } from "src/server/storage/supabase";
import { getUUID } from "src/utils/getUUID";
import { getTypeFromBase64 } from "src/utils/getTypeFromBase64";
import { base64ToBuffer } from "src/utils/base64ToBuffer";
import jwt from "jsonwebtoken";
import { env } from "src/env/server.mjs";
import { sendEmail } from "src/utils/sendEmail";

export const accountRouter = router({
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
      console.log(new Date().toLocaleDateString());

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

  sendVerifyEmail: protectedProcedure.mutation(async ({ ctx }) => {
    if (!ctx.session.user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User not found",
      });
    }

    const user = await ctx.prisma.user.findUnique({
      where: { email: ctx.session.user.email as string },
    });

    if (user?.emailVerified) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Email already verified",
      });
    }

    const token = jwt.sign({ email: user?.email }, env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const url = `${env.NEXTAUTH_URL}/account/verify-email/${token}`;

    const html = `
      <h1>Confirm your email</h1>
      <p>Click the link below to confirm your email</p>
      <a href="${url}">${url}</a>
      `;

    const text = `
      Confirm your email`;

    await sendEmail({
      to: user?.email as string,
      subject: "Confirm your email",
      html,
      text,
    });

    return true;
  }),
  verifyEmail: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const { email } = jwt.verify(input, env.JWT_SECRET) as {
        email: string;
      };

      const user = await ctx.prisma.user.findUnique({
        where: { email: email },
      });

      if (user?.emailVerified) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Email already verified",
        });
      }

      await ctx.prisma.user.update({
        where: { email: email },
        data: {
          emailVerified: new Date(),
        },
      });

      return true;
    }),
  updateAccount: protectedProcedure
    .input(
      z.object({
        name: z.string().optional(),
        email: z.string().optional(),
        newPassword: z.string().optional(),
        passwordConfirmation: z.string().optional(),
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

      if (
        input.newPassword &&
        input.newPassword !== input.passwordConfirmation
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Passwords do not match",
        });
      }

      const updatedUser = await ctx.prisma.user.update({
        where: { email: ctx.session.user.email as string },
        data: {
          name: input?.name ? input.name : user?.name,
          email: input?.email ? input.email : user?.email,
          password: input.newPassword
            ? await bcrypt.hash(input.newPassword, 10)
            : user?.password,
        },
      });

      return updatedUser;
    }),
});
