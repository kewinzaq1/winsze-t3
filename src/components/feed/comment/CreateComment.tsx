import { Input } from "src/components/common/Input";
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

export const CreateComment = ({ postId }: { postId: string }) => {
  console.log("postId", postId);

  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const { show } = useNotifier();

  const { mutate: addComment } = trpc.posts.addComment.useMutation({
    onMutate: async (newComment) => {
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

      const name = session?.user?.name;
      const email = session?.user?.email;
      const image = session?.user?.image;
      const id = session?.user?.id;

      const comment = {
        ...newComment,
        id: getUUID(),
        user: { name, email, image, id },
      };

      await queryClient.cancelQueries(QUERY);
      await queryClient.cancelQueries(POSTS_QUERY);
      await queryClient.cancelQueries(SINGLE_POST_QUERY);

      queryClient.setQueryData(QUERY, (oldData) => {
        return [...(oldData as []), comment];
      });

      queryClient.setQueryData(POSTS_QUERY, (oldData: any) => {
        if (!oldData?.length) return oldData;
        return (oldData as any).map((post: any) => {
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

      queryClient.setQueryData(SINGLE_POST_QUERY, (oldData: any) => ({
        ...oldData,
        _count: {
          ...oldData._count,
          Comment: oldData._count.Comment + 1,
        },
      }));
    },
    onSuccess: () => {
      show({
        type: "success",
        message: "Comment added",
        description: "Your comment has been added",
      });
      resetField("content");
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
      ...data,
    });
  });

  return (
    <form onSubmit={onSubmit}>
      <FormGroup>
        <Label>Add comment:</Label>
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
            placeholder="You comment here!"
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
