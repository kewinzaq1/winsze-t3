import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

export const chatRouter = router({
  getAllConversations: protectedProcedure.query(async ({ ctx }) => {
    const conversations = await ctx.prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            id: ctx.session.user.id,
          },
        },
      },
      include: {
        participants: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    return conversations;
  }),
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
          participants: {
            connect: [
              {
                id: ctx.session.user.id,
              },
              {
                id: followId,
              },
            ],
          },
        },
      });

      return newConversation;
    }),

  sendMessage: protectedProcedure
    .input(
      z.object({
        conversationId: z.string(),
        content: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      console.log("sendMessage");
      const { conversationId, content } = input;
      const newMessage = await ctx.prisma.message.create({
        data: {
          content: content,
          userId: ctx.session.user.id,
          conversationId: conversationId,
        },
      });
      return newMessage;
    }),

  removeAllConversations: protectedProcedure.mutation(async ({ ctx }) => {
    const conversations = await ctx.prisma.conversation.findMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
    const conversationIds = conversations.map((c) => c.id);
    await ctx.prisma.message.deleteMany({
      where: {
        conversationId: {
          in: conversationIds,
        },
      },
    });
    await ctx.prisma.conversation.deleteMany({
      where: {
        userId: ctx.session.user.id,
      },
    });
    return true;
  }),

  testProcedure: protectedProcedure.query(async ({ ctx }) => {
    console.log(ctx.session.user);
    console.log("test");
    return "test";
  }),
});
