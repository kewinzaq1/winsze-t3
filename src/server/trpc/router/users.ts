import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure, router } from "../trpc";

export const usersRouter = router({
  getCurrentUser: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    return user;
  }),

  getUser: protectedProcedure
    .input(
      z.object({
        id: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (!input.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User id is required",
        });
      }

      const { id } = input;
      const user = ctx.prisma.user.findUnique({
        where: {
          id,
        },
        select: {
          Follow: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          image: true,
          Post: {
            select: {
              userId: true,
              image: true,
              Like: true,
              Comment: true,
              id: true,
              content: true,
              createdAt: true,
              updatedAt: true,
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
                },
              },
              _count: {
                select: {
                  Like: true,
                  Comment: true,
                },
              },
            },
          },
          Comment: true,
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      return user;
    }),
  getUsers: protectedProcedure.query(async ({ ctx }) => {
    const users = await ctx.prisma.user.findMany({
      select: {
        Follow: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        image: true,
        id: true,
      },
      where: {
        id: {
          not: ctx.session.user.id,
        },
      },
    });

    return users;
  }),
});
