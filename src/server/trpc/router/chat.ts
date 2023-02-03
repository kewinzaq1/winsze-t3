import { TRPCError } from "@trpc/server";
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
      // find conversation that is between the current user and the user with the id
      const { id } = input;
      const conversation = await ctx.prisma.conversation.findFirst({
        where: {
          id: id,
          AND: [
            {
              participants: {
                some: {
                  id: ctx.session.user.id,
                },
              },
            },
          ],
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
          messages: {
            include: {
              user: true,
            },
          },
        },
      });

      if (!conversation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Conversation not found",
        });
      }

      const user = conversation?.participants.find((participant) => {
        return participant.id !== ctx.session.user.id;
      });

      return { ...conversation, user };
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
      const { conversationId, content } = input;

      const newMessage = await ctx.prisma.message.create({
        data: {
          content: content,
          userId: ctx.session.user.id,
          conversationId: conversationId,
        },
        include: {
          user: true,
        },
      });

      ctx.socket.emit("receivedMessage", newMessage);
      return newMessage;
    }),

  testProcedure: protectedProcedure.query(async ({ ctx }) => {
    console.log(ctx.session.user);
    console.log("test");
    return "test";
  }),
});
