import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { router, protectedProcedure } from "../trpc";

export const friendsRouter = router({
  addUserToFriends: protectedProcedure
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
          message: "You cannot add yourself as a friend",
        });
      }

      const friendExists = await prisma.friend.findUnique({
        where: {
          userId_friendId: {
            userId,
            friendId: session.user.id,
          },
        },
      });

      if (friendExists) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are already friends with this user",
        });
      }

      const friend = await prisma.friend.create({
        data: {
          userId,
          friendId: session.user.id,
        },
      });

      return friend;
    }),
  removeUserFromFriends: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = input;
      const { prisma, session } = ctx;

      const friend = await prisma.friend.delete({
        where: {
          userId_friendId: {
            userId,
            friendId: session.user.id,
          },
        },
      });

      return friend;
    }),
  getFriends: protectedProcedure.input(z.object({})).query(async ({ ctx }) => {
    const { prisma, session } = ctx;

    const friends = await prisma.friend.findMany({
      where: {
        friendId: session.user.id,
      },
      include: {
        user: true,
      },
    });

    return friends;
  }),
});
