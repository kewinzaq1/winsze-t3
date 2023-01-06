import type { RouterOutputs } from "src/utils/trpc";
import { trpc } from "src/utils/trpc";
import avatarPlaceholder from "src/images/avatar_placeholder.png";
import Image from "next/image";
import dayjs from "dayjs";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { useSession } from "next-auth/react";
import { useCallback, useState } from "react";
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
  console.log("comment", comment);

  const queryClient = useQueryClient();
  const [openMenu, setOpenMenu] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const { show } = useNotifier();

  const toggleMenu = useCallback(() => {
    setOpenMenu((c) => !c);
  }, []);

  const toggleEdit = useCallback(() => {
    setEditMode((c) => !c);
    setOpenMenu(false);
  }, []);

  const { mutate: deleteComment } = trpc.posts.deleteComment.useMutation({
    onMutate: async () => {
      const POSTS_QUERY = [["posts", "getPosts"], { input: {}, type: "query" }];
      const QUERY = [
        ["posts", "getPostComments"],
        { input: { postId: comment?.postId }, type: "query" },
      ];
      const SINGLE_POST_QUERY = [
        ["posts", "getPost"],
        { input: { id: comment?.postId }, type: "query" },
      ];

      await queryClient.cancelQueries(QUERY);
      await queryClient.cancelQueries(POSTS_QUERY);
      await queryClient.cancelQueries(SINGLE_POST_QUERY);

      const prevComments = queryClient.getQueryData(QUERY);

      queryClient.setQueryData(QUERY, (old: any) => {
        return old.filter((c: any) => c.id !== comment?.id);
      });

      queryClient.setQueryData(POSTS_QUERY, (old: any) => {
        if (!old?.length) return old;
        return old.map((p: any) => {
          if (p.id === comment?.postId) {
            return {
              ...p,
              _count: {
                ...p._count,
                Comment: p._count.Comment - 1,
              },
            };
          }

          return p;
        });
      });

      queryClient.setQueryData(SINGLE_POST_QUERY, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          _count: {
            ...old._count,
            Comment: old._count.Comment - 1,
          },
        };
      });

      return prevComments;
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

  const handleDeleteComment = useCallback(
    () => deleteComment({ id: `${comment?.id}` }),
    [comment?.id, deleteComment]
  );

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
            onClick={toggleMenu}
            className="ml-auto h-6 w-6"
            role="button"
            tabIndex={0}
            aria-label="manage post"
            title="manage post"
          />
        )}
        {openMenu && (
          <CommentMenu setOpenMenu={setOpenMenu}>
            <CommentMenuButton onClick={toggleEdit}>
              {editMode ? "Cancel" : "Edit"}
            </CommentMenuButton>
            <CommentMenuButton onClick={handleDeleteComment}>
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
              error={errors.content}
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
