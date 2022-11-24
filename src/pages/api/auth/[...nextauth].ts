import NextAuth, { type NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import FacebookProvider from "next-auth/providers/facebook";
import bcrypt from "bcrypt";

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db/client";
import { TRPCError } from "@trpc/server";

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  session: {
    strategy: "jwt",
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    // jwt({ token, user }) {
    //   console.log({ token, user });
    //   if (user) {
    //     token.id = user.id;
    //   }
    //   return token;
    // },
    async signIn({ user, profile }) {
      const image = (profile as { picture: string | undefined })?.picture;

      if (image && user.image !== image) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            image,
          },
        });
      }
      const name = profile?.name;
      if (name && user.name !== name) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            name,
          },
        });
      }

      return true;
    },
    session({ session, token, user }) {
      console.log({ session, token, user });
      return session;
    },
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    FacebookProvider({
      clientId: env.FACEBOOK_CLIENT_ID,
      clientSecret: env.FACEBOOK_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "text", placeholder: "john@doe.com" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new TRPCError({
            code: "PARSE_ERROR",
            message: "Missing email or password",
          });
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials?.email },
        });
        if (!user) {
          throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
        }

        const isValid = await bcrypt.compare(
          credentials?.password,
          user.password
        );
        if (!isValid) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid password",
          });
        }
        return user;
      },
    }),
    // ...add more providers here
  ],
};

export default NextAuth(authOptions);
