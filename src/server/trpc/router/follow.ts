import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { router, protectedProcedure } from "../trpc";

export const followRouter = router({
  follow: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = input;
      const { prisma, session } = ctx;

      if (userId === session.user.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You cannot follow yourself",
        });
      }

      const friendExists = await prisma.follow.findUnique({
        where: {
          userId_followerId: {
            userId,
            followerId: session.user.id,
          },
        },
      });

      if (friendExists) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are already follow this user",
        });
      }

      const friend = await prisma.follow.create({
        data: {
          userId,
          followerId: session.user.id,
        },
      });

      return friend;
    }),
  unFollow: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = input;
      const { prisma, session } = ctx;

      const friend = await prisma.follow.delete({
        where: {
          userId_followerId: {
            userId,
            followerId: session.user.id,
          },
        },
      });

      return friend;
    }),
  getFollowers: protectedProcedure
    .input(z.object({}))
    .query(async ({ ctx }) => {
      const { prisma, session } = ctx;

      const friends = await prisma.follow.findMany({
        where: {
          followerId: session.user.id,
        },
        include: {
          user: true,
          Conversation: true,
        },
      });

      return friends;
    }),
});
