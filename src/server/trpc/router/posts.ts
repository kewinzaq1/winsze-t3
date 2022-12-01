import { TRPCError } from "@trpc/server";
import { storageClient } from "src/server/storage/supabase";
import { base64ToBuffer } from "src/utils/base64ToBuffer";
import { getTypeFromBase64 } from "src/utils/getTypeFromBase64";
import { getUUID } from "src/utils/getUUID";
import { z } from "zod";

import { router, publicProcedure, protectedProcedure } from "../trpc";

export const addPostSchema = z.object({
  title: z.string(),
  content: z.string(),
  image: z.string().url().optional(),
});

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
          .from("avatars")
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
  removePost: protectedProcedure
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
      });

      return posts;
    }),
});
