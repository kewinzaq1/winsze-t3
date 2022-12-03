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
  postId: z.string(),
});

export const postsRouter = router({
  addPost: protectedProcedure
    .input(addPostSchema)
    .mutation(async ({ ctx, input }) => {
      let image = "";
      if (input.image?.length) {
        const fileName = `posts/${getUUID()}.${getTypeFromBase64(input.image)}`;
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
        id: z.string(),
        content: z.string().optional(),
        image: z.string().optional(),
        removePhoto: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      console.log({ input });
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
          id: input.postId,
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
          id: input.postId,
        },
      });
    }),
  getPosts: publicProcedure
    .input(getPostsSchema)
    .query(async ({ ctx, input }) => {
      const posts = await ctx.prisma.post.findMany({
        where: {
          userId: input.userId,
        },
        include: {
          user: true,
        },
      });

      return posts;
    }),
});
