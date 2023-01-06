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
  getAllFriends: protectedProcedure
    .input(z.object({}))
    .query(async ({ ctx }) => {
      const { prisma, session } = ctx;

      const friends = await prisma.friend.findMany({
        where: {
          userId: session.user.id,
        },
      });

      return friends;
    }),
});
