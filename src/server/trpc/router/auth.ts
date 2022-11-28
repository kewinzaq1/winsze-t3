import bcrypt from "bcrypt";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { registerSchema } from "src/zod/auth";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { getUUID } from "src/utils/getUUID";
import { createTransport } from "nodemailer";
import { env } from "src/env/server.mjs";

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
  sendResetPasswordToken: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!input.email) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Email is required",
        });
      }

      const user = await ctx.prisma.user.findUnique({
        where: { email: input.email },
      });
      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      const token = await ctx.prisma.resetToken.create({
        data: {
          user: {
            connect: {
              id: user.id,
            },
          },
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
          token: getUUID(),
        },
      });

      const url = `http://localhost:3000/reset-password?token=${token.token}`;
      const { host } = new URL(url);

      const transport = createTransport(env.EMAIL_SERVER);
      const result = await transport.sendMail({
        to: input.email,
        from: env.EMAIL_FROM,
        subject: `Reset password in ${host}`,
        text: text({ url, host }),
        html: html({ url, host }),
      });
      const failed = result.rejected.concat(result.pending).filter(Boolean);
      if (failed.length) {
        throw new Error(`Email(s) (${failed.join(", ")}) could not be sent`);
      }

      return token;
    }),
  resetPassword: publicProcedure
    .input(
      z.object({
        password: z.string().min(8),
        passwordConfirmation: z.string().min(8),
        token: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.password !== input.passwordConfirmation) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Passwords do not match",
        });
      }
      console.log(input.token);

      const token = await ctx.prisma.resetToken.findUnique({
        where: { token: input.token },
        include: { user: true },
      });
      if (!token) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Token not found",
        });
      }
      if (token.expires < new Date()) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Token expired",
        });
      }
      const password = await bcrypt.hash(input.password, 10);
      const user = await ctx.prisma.user.update({
        where: { id: token.user.id },
        data: {
          password,
        },
      });
      await ctx.prisma.resetToken.delete({
        where: { id: token.id },
      });

      return user;
    }),
});

function html(params: { url: string; host: string }) {
  const { url, host } = params;

  const escapedHost = host.replace(/\./g, "&#8203;.");

  const brandColor = "#346df1";
  const color = {
    background: "#f9f9f9",
    text: "#444",
    mainBackground: "#fff",
    buttonBackground: brandColor,
    buttonBorder: brandColor,
    buttonText: "#fff",
  };

  return `
<body style="background: ${color.background};">
  <table width="100%" border="0" cellspacing="20" cellpadding="0"
    style="background: ${color.mainBackground}; max-width: 600px; margin: auto; border-radius: 10px;">
    <tr>
      <td align="center"
        style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        Reset password in <strong>${escapedHost}</strong>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="border-radius: 5px;" bgcolor="${color.buttonBackground}"><a href="${url}"
                target="_blank"
                style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${color.buttonText}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${color.buttonBorder}; display: inline-block; font-weight: bold;">Reset password</a></td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center"
        style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};">
        If you did not request this email you can safely ignore it.
      </td>
    </tr>
  </table>
</body>
`;
}

/** Email Text body (fallback for email clients that don't render HTML, e.g. feature phones) */
function text({ url, host }: { url: string; host: string }) {
  return `Reset password in ${host}\n${url}\n\n`;
}
