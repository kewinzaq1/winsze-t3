import { TRPCError } from "@trpc/server";
import { storageClient } from "src/server/storage/supabase";
import { base64ToBuffer } from "src/utils/base64ToBuffer";
import { getTypeFromBase64 } from "src/utils/getTypeFromBase64";
import { getUUID } from "src/utils/getUUID";
import { addPostSchema } from "src/zod/addPostSchema";
import { z } from "zod";

import { router, publicProcedure, protectedProcedure } from "../trpc";

const getPostsSchema = z.object({
  userId: z.string().optional(),
});

const deletePostSchema = z.object({
  id: z.string(),
});

export const postsRouter = router({
  addPost: protectedProcedure
    .input(addPostSchema)
    .mutation(async ({ ctx, input }) => {
      let image = "";
      if (input.image?.length) {
        const fileName = `posts/${input.id}.${getTypeFromBase64(input.image)}`;
        const { error } = await storageClient
          .from("posts")
          .upload(fileName, base64ToBuffer(input.image));
        if (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message,
          });
        }
        const { data: url } = storageClient
          .from("posts")
          .getPublicUrl(fileName);
        image = url.publicUrl;
      }

      const userId = ctx.session.user.id;

      const post = await ctx.prisma.post.create({
        data: {
          ...input,
          image: image.length > 0 ? image : null,
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });

      return post;
    }),
  editPost: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        content: z.string().optional(),
        image: z.string().optional(),
        removePhoto: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const post = await ctx.prisma.post.findFirst({
        where: {
          id: input.id,
          userId,
        },
      });
      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }
      let image = "";
      if (input.image?.length) {
        const fileName = `posts/${getUUID()}.${getTypeFromBase64(input.image)}`;
        const { error } = await storageClient
          .from("posts")
          .upload(fileName, base64ToBuffer(input.image), {
            upsert: true,
          });
        if (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message,
          });
        }
        const { data: url } = storageClient
          .from("posts")
          .getPublicUrl(fileName);
        image = url.publicUrl;
      }

      const getImage = () => {
        if (input.removePhoto) {
          return null;
        }
        if (input.image?.length) {
          return image;
        }
        return post.image;
      };

      const updatedPost = await ctx.prisma.post.update({
        where: {
          id: input.id,
        },
        data: {
          content: input.content,
          image: getImage(),
        },
      });

      return updatedPost;
    }),

  deletePost: protectedProcedure
    .input(deletePostSchema)
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const post = await ctx.prisma.post.findUnique({
        where: {
          id: input.id,
        },
      });

      if (post?.userId !== userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to delete this post",
        });
      }

      return ctx.prisma.post.delete({
        where: {
          id: input.id,
        },
      });
    }),
  getPosts: publicProcedure
    .input(getPostsSchema)
    .query(async ({ ctx, input }) => {
      const followingUsers = await ctx.prisma.user.findMany({
        where: {
          Follow: {
            some: {
              followerId: input.userId,
            },
          },
        },
      });

      const followingUsersIds = followingUsers.map((user) => user.id);
      console.log("followingUsersIds", followingUsersIds);

      const posts = await ctx.prisma.post.findMany({
        where: {
          OR: [
            {
              userId: {
                in: followingUsersIds,
              },
            },
          ],
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          Like: true,
          _count: {
            select: {
              Like: true,
              Comment: true,
            },
          },
        },
      });

      return posts;
    }),
  getPost: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const post = await ctx.prisma.post.findUnique({
        where: {
          id: input.id,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          Like: true,
          _count: {
            select: {
              Like: true,
              Comment: true,
            },
          },
        },
      });

      return post;
    }),
  reportPost: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const post = await ctx.prisma.post.findUnique({
        where: {
          id: input.id,
        },
      });

      if (post?.userId === userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You can't report your own post",
        });
      }

      const reportedPost = await ctx.prisma.report.create({
        data: {
          user: {
            connect: {
              id: userId,
            },
          },
          post: {
            connect: {
              id: input.id,
            },
          },
        },
      });

      return reportedPost;
    }),
  toggleLike: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const post = await ctx.prisma.post.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }

      const like = await ctx.prisma.like.findFirst({
        where: {
          userId,
          postId: input.id,
        },
      });

      if (like) {
        return ctx.prisma.like.delete({
          where: {
            id: like.id,
          },
        });
      }

      return ctx.prisma.like.create({
        data: {
          user: {
            connect: {
              id: userId,
            },
          },
          post: {
            connect: {
              id: input.id,
            },
          },
        },
      });
    }),
  addComment: protectedProcedure
    .input(
      z.object({
        postId: z.string(),
        content: z.string(),
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { postId, content, id } = input;

      if (!input.content.length) {
        throw new TRPCError({
          code: "PARSE_ERROR",
          message: "Comment content is required",
        });
      }

      const comment = await ctx.prisma.comment.create({
        data: {
          content,
          id,
          user: {
            connect: {
              id: userId,
            },
          },
          post: {
            connect: {
              id: postId,
            },
          },
        },
      });

      return await ctx.prisma.comment.findFirst({
        where: {
          id: comment.id,
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
              image: true,
              id: true,
            },
          },
        },
      });
    }),
  deleteComment: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const comment = await ctx.prisma.comment.findFirst({
        where: {
          id: input.id,
        },
      });

      if (!comment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Comment not found",
        });
      }

      if (comment.userId !== userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to delete this comment",
        });
      }

      return ctx.prisma.comment.delete({
        where: {
          id: input.id,
        },
      });
    }),
  getPostComments: publicProcedure
    .input(
      z.object({
        postId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const comments = await ctx.prisma.comment.findMany({
        where: {
          postId: input.postId,
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
              image: true,
              id: true,
            },
          },
        },
      });
      comments.sort((a, b) => {
        return a.createdAt < b.createdAt ? 1 : -1;
      });

      return comments;
    }),
  editComment: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        content: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const comment = await ctx.prisma.comment.findFirst({
        where: {
          id: input.id,
        },
      });

      if (!comment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Comment not found",
        });
      }

      if (comment.userId !== userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to edit this comment",
        });
      }

      return ctx.prisma.comment.update({
        where: {
          id: input.id,
        },
        data: {
          content: input.content,
        },
      });
    }),
});
