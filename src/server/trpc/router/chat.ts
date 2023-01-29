import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const chatRouter = router({
  getConversation: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { id } = input;
      const conversation = await ctx.prisma.conversation.findUnique({
        where: { id: id },
        include: {
          Message: {
            orderBy: {
              createdAt: "asc",
            },
            include: {
              user: true,
            },
          },
          Follow: {
            include: {
              user: true,
            },
          },
          User: true,
        },
      });
      return conversation;
    }),
  createConversation: protectedProcedure
    .input(
      z.object({
        followId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { followId } = input;

      const newConversation = await ctx.prisma.conversation.create({
        data: {
          Follow: {
            connect: {
              id: followId,
            },
          },
          User: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });

      return newConversation;
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

  deleteAllChatRoomUser: protectedProcedure.mutation(async ({ ctx }) => {
    const deleted = await ctx.prisma.chatRoomUser.deleteMany();
    return deleted;
  }),
});
