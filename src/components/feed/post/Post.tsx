import Image from "next/image";
import type { RouterOutputs } from "src/utils/trpc";
import { trpc } from "src/utils/trpc";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import type { Ref } from "react";
import { createRef, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { IoMdRemoveCircle } from "react-icons/io";
import { FcStackOfPhotos } from "react-icons/fc";
import { Button } from "../../common/Button";
import { GiFlyingDagger } from "react-icons/gi";
import { imgToBase64 } from "src/utils/imgToBase64";
import { Textarea } from "../../common/Textarea";
import { useSession } from "next-auth/react";
import { useClickAway } from "src/hooks/useClickAway";
import { PostMenu } from "./PostMenu";
import { PostMenuButton } from "./PostMenuButton";
import {
  AiOutlineHeart,
  AiFillHeart,
  AiOutlineComment,
  AiOutlineShareAlt,
} from "react-icons/ai";
import { FaRegComment } from "react-icons/fa";
import relativeRime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import dayjs from "dayjs";
import { useNotifier } from "../../notifier";
import { useQueryClient } from "@tanstack/react-query";
import { Comment } from "../comment/Comment";

dayjs.extend(relativeRime);
dayjs.extend(updateLocale);
dayjs.updateLocale("en", {
  relativeTime: {
    future: "in %s",
    past: "%s ago",
    s: "a few seconds",
    m: "1m",
    mm: "%dm",
    h: "1h",
    hh: "%dh",
    d: "1d",
    dd: "%dd",
    M: "1M",
    MM: "%dM",
    y: "1y",
    yy: "%dy",
  },
});

export const Post = (post: RouterOutputs["posts"]["getPosts"][number]) => {
  const queryClient = useQueryClient();
  const { show } = useNotifier();
  const utils = trpc.useContext();
  const [openMenu, setOpenMenu] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);

  const [mode, setMode] = useState<"edit" | "preview">("preview");
  const [image, setImage] = useState(post.image ?? "");
  const { data: session } = useSession();

  const {
    mutate: editPost,
    error: editError,
    isLoading: isEditLoading,
  } = trpc.posts.editPost.useMutation({
    onSuccess: () => {
      setMode("preview");
      utils.posts.getPosts.invalidate({});
      show({
        message: "Post edited",
        description: "Your post has been edited successfully",
        type: "success",
      });
    },
    onError: (err) => {
      show({
        message: err.message,
        description: err?.message,
        type: "error",
      });
    },
  });

  const {
    formState: { errors },
    register,
    handleSubmit,
    watch,
    resetField,
    setFocus,
  } = useForm({
    resolver: zodResolver(
      z.object({ content: z.string(), image: z.any().optional() })
    ),
    defaultValues: {
      content: post.content,
      image: [] as unknown as FileList,
    },
  });

  const isAuthor = post.userId === session?.user?.id;

  const isEdit = mode === "edit";
  const isPreview = mode === "preview";
  const setEdit = () => {
    setMode("edit");
    setTimeout(() => setFocus("content"), 100);
    setOpenMenu(false);
  };

  const clearImage = () => {
    setImage("");
    resetField("image");
  };

  useEffect(() => {
    const subscription = watch((value) => {
      console.log(value);
      if (!value.image?.[0]) {
        return;
      }
      const url = URL.createObjectURL(value.image[0]);
      setImage(url);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit = handleSubmit(async (values) => {
    if (!values.image.length) {
      editPost({
        id: post.id,
        content: values.content,
        removePhoto: !Boolean(image.length),
      });
      return;
    }
    const sendingImage = await imgToBase64(values.image[0] as File);
    editPost({
      id: post.id,
      content: values.content,
      image: sendingImage as string,
      removePhoto: !Boolean(image.length),
    });
  });

  const menuRef = createRef<HTMLElement>();
  useClickAway(menuRef, () => setOpenMenu(false));

  const { mutate: deletePost, isLoading: isDeleting } =
    trpc.posts.deletePost.useMutation({
      onSuccess: () => {
        utils.posts.getPosts.invalidate({});
        setOpenConfirm(false);
        setOpenMenu(false);
        show({
          message: "Post deleted",
          description: "Your post has been deleted successfully",
          type: "success",
        });
      },
      onError: (err) => {
        show({
          message: err.message,
          description: err?.message,
          type: "error",
        });
      },
    });

  const userLike = post.Like.find((like) => like.userId === session?.user?.id);

  const { mutate: toggleLike } = trpc.posts.toggleLike.useMutation({
    onMutate: async () => {
      await queryClient.cancelQueries([
        ["posts", "getPosts"],
        { input: {}, type: "query" },
      ]);
      const previousValue = queryClient.getQueryData([
        ["posts", "getPosts"],
        { input: {}, type: "query" },
      ]);
      queryClient.setQueryData(
        [["posts", "getPosts"], { input: {}, type: "query" }],
        (old: any) => {
          const postIndex = old.findIndex((p: any) => p.id === post.id);
          const updatedPost = old[postIndex];
          const likeIndex = updatedPost.Like.findIndex(
            (like: any) => like.userId === session?.user?.id
          );
          if (likeIndex !== -1) {
            updatedPost.Like.splice(likeIndex, 1);
            updatedPost._count.Like--;
          } else {
            updatedPost.Like.push({ userId: session?.user?.id });
            updatedPost._count.Like++;
          }
          old[postIndex] = updatedPost;
          return old;
        }
      );
      return previousValue;
    },
  });

  const { mutate: reportPost } = trpc.posts.reportPost.useMutation({
    onSuccess: () => {
      setOpenMenu(false);
    },
  });

  const Edit = (
    <form onSubmit={onSubmit}>
      {isEdit && (
        <Textarea
          maxLength={255}
          placeholder="What is on your mind?"
          {...register("content")}
        />
      )}
      {Boolean(image.length) && isEdit && (
        <>
          <Image
            width={500}
            height={500}
            src={image}
            alt={image}
            className="mt-2 h-[500px] w-full object-cover"
          />
          <IoMdRemoveCircle
            onClick={clearImage}
            role="button"
            tabIndex={0}
            aria-label="remove photo"
            className="absolute right-20 bottom-4 h-12 w-12 text-red-500"
          />
        </>
      )}
      <input
        id={`photo${post.id}`}
        accept="image/*"
        className="hidden"
        {...register("image")}
        type="file"
      />
      <label htmlFor={`photo${post.id}`}>
        <FcStackOfPhotos
          role="button"
          tabIndex={0}
          className="absolute right-4 bottom-4 h-12 w-12"
          title="pick a photo"
        />
      </label>
      <Button
        type="submit"
        variant="secondary"
        isLoading={isEditLoading}
        title="save post"
        aria-label="save post"
        className="mt-4 w-max"
      >
        <GiFlyingDagger />
      </Button>
    </form>
  );

  return (
    <>
      <div className="relative flex w-full select-none flex-col rounded-md p-4 shadow-md">
        <div className="flex py-2">
          <Image
            src={`${post.user.image}`}
            width={50}
            height={50}
            alt={`${post.user.name}`}
            className="h-16 w-16 rounded-full object-cover"
          />
          <div className="ml-2 flex flex-col">
            <p className="text-xs">{dayjs(post.createdAt).fromNow()}</p>
            <p className="text-sm  opacity-40">{post.user.email}</p>
            <p className="text-xl font-light">
              {post.user.name || post.user.email?.split("@")[0]}
            </p>
          </div>
          {isAuthor && (
            <BiDotsHorizontalRounded
              className="pointer z-1 absolute top-4 right-4 h-8 w-8"
              role="button"
              tabIndex={0}
              aria-label="manage post"
              title="manage post"
              onClick={() => {
                if (!openMenu) {
                  setOpenMenu(true);
                }
              }}
            />
          )}
        </div>
        <div className="mt-2 flex flex-col">
          {isPreview && <p className="text-2xl">{post.content}</p>}
          {post.image && isPreview && (
            <Image
              width={500}
              height={500}
              src={post.image}
              alt={post.content}
              className="mt-2 h-full w-full rounded-md object-contain"
            />
          )}
          {isPreview && (
            <div className="flex w-full items-center">
              <button
                className="flex items-center gap-1"
                onClick={() => toggleLike({ id: post.id })}
                aria-label={`${userLike ? "unlike" : "like"} post`}
                title={`${userLike ? "unlike" : "like"} post`}
              >
                {post._count.Like}
                {userLike ? (
                  <AiFillHeart color="red" className="h-8 w-8" />
                ) : (
                  <AiOutlineHeart className="h-8 w-8" />
                )}
              </button>
              <button
                className="rounded-md p-2"
                aria-label="show comments"
                title="show comment"
              >
                <AiOutlineComment className="h-8 w-8" />
              </button>
              <button
                className="ml-auto justify-self-end rounded-md p-2"
                aria-label="share post"
                title="share-post"
              >
                <AiOutlineShareAlt className="h-8 w-8" />
              </button>
            </div>
          )}
          {isEdit && Edit}
          <Comment
            id={""}
            content={""}
            userId={""}
            postId={""}
            createdAt={new Date()}
            updatedAt={new Date()}
            user={{
              name: "Adam Kowalski",
              email: null,
              image: null,
              id: "clay513z10000g7j1o3k6quxm",
            }}
          />
        </div>
        {openMenu && (
          <PostMenu ref={menuRef as Ref<HTMLDivElement>}>
            <PostMenuButton
              onClick={() => {
                if (isPreview) {
                  return setEdit();
                }
                return setMode("preview");
              }}
            >
              {isPreview ? "Edit" : "Cancel edit"}
            </PostMenuButton>
            <PostMenuButton onClick={() => setOpenConfirm(true)}>
              Delete
            </PostMenuButton>
            <PostMenuButton
              onClick={() => {
                reportPost({ postId: post.id });
              }}
            >
              report
            </PostMenuButton>
          </PostMenu>
        )}
      </div>

      {openConfirm && (
        <div
          className="fixed inset-0 z-50 flex h-screen w-screen items-center justify-center bg-black bg-opacity-20"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setOpenConfirm(false);
              setOpenMenu(false);
            }
          }}
        >
          <div className="z-50 mx-4 flex h-max w-full max-w-xl flex-col gap-4 rounded-md bg-white p-4 shadow-md">
            <header>
              <p className="text-2xl font-semibold">Are you sure?</p>
              <p>To delete this post</p>
            </header>
            <footer className="flex w-full items-center justify-end gap-2">
              <Button
                variant="secondary"
                className="p-2"
                onClick={() => {
                  setOpenConfirm(false);
                  setOpenMenu(false);
                }}
              >
                cancel
              </Button>
              <Button
                variant="error"
                className="p-2"
                isLoading={isDeleting}
                onClick={() => deletePost({ postId: post.id })}
              >
                delete
              </Button>
            </footer>
          </div>
        </div>
      )}
    </>
  );
};
