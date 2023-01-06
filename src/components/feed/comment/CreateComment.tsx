import { Input } from "src/components/common/Input";
import type { RouterOutputs } from "src/utils/trpc";
import { trpc } from "src/utils/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { FormGroup } from "src/components/common/FormGroup";
import { Label } from "src/components/common/Label";
import { GiFlyingDagger } from "react-icons/gi";
import { Button } from "src/components/common/Button";
import Image from "next/image";
import { useSession } from "next-auth/react";
import avatarPlaceholder from "src/images/avatar_placeholder.png";
import { useQueryClient } from "@tanstack/react-query";
import { useNotifier } from "src/components/notifier";
import { getUUID } from "src/utils/getUUID";
import { useRouter } from "next/router";

export const CreateComment = ({ postId }: { postId: string }) => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const { show } = useNotifier();
  const router = useRouter();

  const { mutate: addComment } = trpc.posts.addComment.useMutation({
    onMutate: async (newComment) => {
      resetField("content");

      const QUERY = [
        ["posts", "getPostComments"],
        {
          input: {
            postId,
          },
          type: "query",
        },
      ];
      const POSTS_QUERY = [["posts", "getPosts"], { input: {}, type: "query" }];
      const SINGLE_POST_QUERY = [
        ["posts", "getPost"],
        { input: { id: postId }, type: "query" },
      ];
      const USER_QUERY = [
        ["users", "getUser"],
        { input: { id: router.query.id }, type: "query" },
      ];

      const name = session?.user?.name;
      const email = session?.user?.email;
      const image = session?.user?.image;
      const id = session?.user?.id;

      const comment = {
        ...newComment,
        createdAt: new Date(),
        user: { name, email, image, id },
      };

      await queryClient.cancelQueries(QUERY);
      await queryClient.cancelQueries(POSTS_QUERY);
      await queryClient.cancelQueries(SINGLE_POST_QUERY);
      if (router.query.id) await queryClient.cancelQueries(USER_QUERY);

      queryClient.setQueryData(QUERY, (old: unknown) => {
        const oldData = old as RouterOutputs["posts"]["getPostComments"];
        return [...oldData, comment];
      });

      queryClient.setQueryData(POSTS_QUERY, (old: unknown) => {
        const oldData = old as RouterOutputs["posts"]["getPosts"];
        if (!oldData?.length) return oldData;
        return oldData.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              _count: {
                ...post._count,
                Comment: post._count.Comment + 1,
              },
            };
          }
          return post;
        });
      });

      if (router.query.id) {
        queryClient.setQueryData(USER_QUERY, (old: unknown) => {
          const oldData = old as RouterOutputs["users"]["getUser"];
          if (!oldData) return oldData;

          const filtered = oldData.Post.filter((post) => post.id !== postId);
          const updated = oldData.Post.find((post) => post.id === postId);
          if (updated) {
            return {
              ...oldData,
              Post: [
                ...filtered,
                {
                  ...updated,
                  _count: {
                    ...updated._count,
                    Comment: updated._count.Comment + 1,
                  },
                },
              ],
            };
          }
          return oldData;
        });
      }

      queryClient.setQueryData(SINGLE_POST_QUERY, (old: unknown) => {
        const oldData = old as RouterOutputs["posts"]["getPost"];
        if (!oldData) return oldData;
        return {
          ...oldData,
          _count: {
            ...oldData._count,
            Comment: oldData._count.Comment + 1,
          },
        };
      });
    },
    onSuccess: () => {
      show({
        type: "success",
        message: "Comment added",
        description: "Your comment has been added",
      });
    },
    onError: (error) => {
      show({
        type: "error",
        message: "Error adding comment",
        description: error.message,
      });
    },
  });

  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(
      z.object({
        content: z
          .string()
          .min(1, "Comment cannot be empty")
          .max(500, "Comment cannot be longer than 500 characters"),
      })
    ),
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = handleSubmit((data) => {
    addComment({
      postId,
      id: getUUID(),
      ...data,
    });
  });

  return (
    <form onSubmit={onSubmit}>
      <FormGroup>
        <Label className="py-2 text-lg font-semibold">Add comment:</Label>
        <div className="flex items-center gap-2">
          <Image
            src={session?.user?.image ?? avatarPlaceholder}
            width={50}
            height={50}
            className="h-12 w-12 rounded-full"
            alt={`avatar ${
              session?.user?.name || session?.user?.email?.split("@")[0]
            }`}
          />
          <Input
            placeholder="Your comment here!"
            {...register("content")}
            className="h-max max-h-48 w-full"
            error={errors.content}
          ></Input>
          <Button
            className="w-max"
            title="add comment"
            aria-label="add comment"
          >
            <GiFlyingDagger />
          </Button>
        </div>
      </FormGroup>
    </form>
  );
};
