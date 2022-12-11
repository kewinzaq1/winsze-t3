import type { RouterOutputs } from "src/utils/trpc";
import { trpc } from "src/utils/trpc";
import avatarPlaceholder from "src/images/avatar_placeholder.png";
import Image from "next/image";
import dayjs from "dayjs";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useNotifier } from "src/components/notifier";
import { CommentMenuButton } from "./CommentMenuButton";
import { CommentMenu } from "./CommentMenu";
import { useQueryClient } from "@tanstack/react-query";
import { Input } from "src/components/common/Input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "src/components/common/Button";
import { AiOutlineSave } from "react-icons/ai";

export const Comment = (comment: RouterOutputs["posts"]["addComment"]) => {
  const queryClient = useQueryClient();
  const [openMenu, setOpenMenu] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const { show } = useNotifier();

  const { mutate: deleteComment } = trpc.posts.deleteComment.useMutation({
    onMutate: async () => {
      await queryClient.cancelQueries([
        ["posts", "getPostComments"],
        { input: { postId: comment?.postId }, type: "query" },
      ]);
      const previousComments = queryClient.getQueryData([
        ["posts", "getPostComments"],
        { input: { postId: comment?.postId }, type: "query" },
      ]);
      queryClient.setQueryData(
        [
          ["posts", "getPostComments"],
          { input: { postId: comment?.postId }, type: "query" },
        ],
        (old: any) => {
          return old.filter((c: any) => c.id !== comment?.id);
        }
      );
      return { previousComments };
    },
    onSuccess: () => {
      setOpenMenu(false);
      show({
        type: "success",
        message: "Comment deleted",
        description: "Your comment has been deleted",
      });
    },
    onError: (error) => {
      show({
        type: "error",
        message: "Error deleting comment",
        description: error.message,
      });
    },
  });

  const { mutate: editComment } = trpc.posts.editComment.useMutation({
    onMutate: async ({ content }) => {
      const QUERY = [
        ["posts", "getPostComments"],
        {
          input: {
            postId: comment?.postId,
          },
          type: "query",
        },
      ];

      queryClient.cancelQueries(QUERY);
      const previousComments = queryClient.getQueryData(QUERY);
      queryClient.setQueryData(QUERY, (old) => {
        return (old as RouterOutputs["posts"]["getPostComments"]).map((c) => {
          if (c.id === comment?.id) {
            return {
              ...c,
              content,
            };
          }
          return c;
        });
      });

      return previousComments;
    },
    onSuccess: () => {
      show({
        type: "success",
        message: "Comment updated",
        description: "Your comment has been updated",
      });
    },
  });

  const userIsAuthor = comment?.user.id === useSession().data?.user?.id;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(z.object({ content: z.string().min(1) })),
    defaultValues: {
      content: comment?.content ?? "",
    },
  });

  const handleEdit = handleSubmit((data) => {
    const { content } = data;
    if (!comment?.id) {
      show({
        type: "error",
        message: "Error updating comment",
        description: "Comment id is missing",
      });
      return;
    }
    editComment({
      id: comment?.id,
      content,
    });
    setEditMode(false);
  });

  if (!comment) {
    return <></>;
  }

  return (
    <div className="relative mt-4">
      <header className="flex items-center">
        <Image
          src={comment?.user.image ?? avatarPlaceholder}
          width={50}
          height={50}
          alt={`${comment?.user?.name}`}
          className="h-12 w-12 rounded-full object-cover"
        />
        <div className="ml-2 flex flex-col">
          <p className="text-xs">{dayjs(comment?.createdAt).fromNow()}</p>
          <p className="text-lg">
            {comment?.user.name || comment?.user.email?.split("@")[0]}
          </p>
        </div>
        {userIsAuthor && !openMenu && (
          <BiDotsHorizontalRounded
            onClick={() => setOpenMenu((c) => !c)}
            className="ml-auto h-6 w-6"
            role="button"
            tabIndex={0}
            aria-label="manage post"
            title="manage post"
          />
        )}
        {openMenu && (
          <CommentMenu setOpenMenu={setOpenMenu}>
            <CommentMenuButton
              onClick={() => {
                setEditMode(true);
                setOpenMenu(false);
              }}
            >
              Edit
            </CommentMenuButton>
            <CommentMenuButton
              onClick={() => deleteComment({ id: comment?.id })}
            >
              Delete
            </CommentMenuButton>
          </CommentMenu>
        )}
      </header>
      <div>
        {editMode ? (
          <form
            className="mt-4 flex w-full items-center gap-2"
            onSubmit={handleEdit}
          >
            <Input
              className="w-full"
              {...register("content")}
              error={Boolean(errors.content)}
            />
            <Button
              className="w-max"
              type="submit"
              aria-label="save post"
              title="save post"
            >
              <AiOutlineSave />
            </Button>
          </form>
        ) : (
          <p>{comment?.content}</p>
        )}
      </div>
    </div>
  );
};
