import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const chatRouter = router({
  getRooms: protectedProcedure.query(async ({ ctx }) => {
    const rooms = await ctx.prisma.chatRoom.findMany({
      where: {
        ownerId: ctx.session.user.id,
      },
    });
    return rooms;
  }),
  getRoom: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      // first find room if it exists
      const foundedRoom = await ctx.prisma.chatRoom.findUnique({
        where: {
          id: input.id,
        },
        include: {
          owner: {
            select: {
              name: true,
              image: true,
            },
          },
          ChatRoomUser: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true,
                  image: true,
                },
              },
            },
          },
          Message: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true,
                  image: true,
                },
              },
            },
          },
        },
      });
      if (foundedRoom) {
        return foundedRoom;
      }
      // if room is not found, create room
      const room = await ctx.prisma.chatRoom.create({
        data: {
          id: input.id,
          ownerId: ctx.session.user.id,
          ChatRoomUser: {
            createMany: {
              data: [
                {
                  userId: input.id,
                },
                {
                  userId: ctx.session.user.id,
                },
              ],
            },
          },
        },
        include: {
          owner: {
            select: {
              name: true,
              image: true,
            },
          },
          ChatRoomUser: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true,
                  image: true,
                },
              },
            },
          },
          Message: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true,
                  image: true,
                },
              },
            },
          },
        },
      });
      return room;
    }),
  getMessages: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const messages = await ctx.prisma.message.findMany({
        where: {
          chatRoomId: input.id,
        },
      });
      return messages;
    }),
  sendMessage: protectedProcedure
    .input(
      z.object({
        chatRoomId: z.string(),
        content: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const message = await ctx.prisma.message.create({
        data: {
          chatRoomId: input.chatRoomId,
          userId: ctx.session.user.id,
          content: input.content,
        },
      });
      return message;
    }),
});
