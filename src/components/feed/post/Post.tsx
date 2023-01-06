import dayjs from "dayjs";
import relativeRime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import Image from "next/image";
import Link from "next/link";
import { LegacyRef, Ref, useCallback } from "react";
import {
  AiFillHeart,
  AiOutlineComment,
  AiOutlineHeart,
  AiOutlineShareAlt,
} from "react-icons/ai";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { FcStackOfPhotos } from "react-icons/fc";
import { GiFlyingDagger } from "react-icons/gi";
import { IoMdRemoveCircle } from "react-icons/io";
import type { RouterOutputs } from "src/utils/trpc";
import { Button } from "../../common/Button";
import { Textarea } from "../../common/Textarea";
import { Comments } from "../comment/Comments";
import { PostMenu } from "./PostMenu";
import { PostMenuButton } from "./PostMenuButton";
import avatarPlaceholder from "src/images/avatar_placeholder.png";
import { PostProvider, usePost } from "./PostContext";
import { useAutoAnimate } from "@formkit/auto-animate/react";

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

export type PostType = RouterOutputs["posts"]["getPosts"][number];

interface Props {
  post: PostType;
  userId?: string;
  singlePost?: boolean;
}

const Edit = () => {
  const { onSubmit, register, isEdit, image, clearImage, isEditLoading, post } =
    usePost();

  return (
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
};

const BasePost = () => {
  const {
    isAuthor,
    isEdit,
    isPreview,
    isDeleting,
    openMenu,
    openConfirm,
    openComments,
    setOpenMenu,
    setOpenConfirm,
    setOpenComments,
    menuRef,
    deletePost,
    userLike,
    toggleLike,
    reportPost,
    saveLink,
    setMode,
    post,
    setEdit,
  } = usePost();

  const cancelEdit = useCallback(() => {
    setOpenConfirm(false);
    setOpenMenu(false);
  }, []);

  const toggleEdit = useCallback(() => {
    if (isPreview) {
      return setEdit();
    }
    return setMode("preview");
  }, []);

  const handleDelete = useCallback(() => {
    setOpenConfirm(true);
  }, []);

  const handleMenu = useCallback(() => {
    setOpenMenu((c) => !c);
  }, []);

  const [ref] = useAutoAnimate();

  return (
    <div className="relative flex w-full select-none flex-col rounded-md p-4 shadow-md">
      <div className="flex py-2">
        {!post.user.image ? (
          <Image
            src={avatarPlaceholder}
            width={50}
            height={50}
            alt={`${post.user.name} avatar`}
            className="h-16 w-16 rounded-full object-cover"
            placeholder="blur"
          />
        ) : (
          <Image
            src={`${post.user.image}`}
            width={50}
            height={50}
            alt={`${post.user.name} avatar`}
            className="h-16 w-16 rounded-full object-cover"
          />
        )}
        <div className="ml-2 flex flex-col">
          <p className="text-xs">{dayjs(post.createdAt).fromNow()}</p>
          <p className="text-sm  opacity-40">{post.user.email}</p>
          <Link href={`/users/${post.user.id}`} className="text-xl font-light">
            {post.user.name || post.user.email?.split("@")[0]}
          </Link>
        </div>
        {isAuthor && (
          <BiDotsHorizontalRounded
            className="pointer z-1 absolute top-4 right-4 h-8 w-8"
            role="button"
            tabIndex={0}
            aria-label="manage post"
            title="manage post"
            onClick={handleMenu}
          />
        )}
      </div>
      <div
        className="mt-2 flex flex-col"
        ref={ref as LegacyRef<HTMLDivElement>}
      >
        {isPreview && <p className="text-2xl">{post.content}</p>}
        {post.image?.length && isPreview && (
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
              onClick={toggleLike}
              aria-label={`${userLike ? "unlike" : "like"} post`}
              title={`${userLike ? "unlike" : "like"} post`}
            >
              {Boolean(post._count.Like) && (
                <span className="text-sm">{post._count.Like}</span>
              )}
              {userLike ? (
                <AiFillHeart color="red" className="h-8 w-8" />
              ) : (
                <AiOutlineHeart className="h-8 w-8" />
              )}
            </button>
            <button
              className="flex items-center gap-1 rounded-md p-2"
              aria-label={`${openComments ? "hide" : "show"} comment}`}
              title={`${openComments ? "hide" : "show"} comment`}
              onClick={() => setOpenComments((prev) => !prev)}
            >
              {Boolean(post._count.Comment) && (
                <span className="text-sm">{post._count.Comment}</span>
              )}
              <AiOutlineComment className="h-8 w-8" />
            </button>
            <button
              className="ml-auto justify-self-end rounded-md p-2"
              aria-label="share post"
              title="share-post"
              onClick={saveLink}
            >
              <AiOutlineShareAlt className="h-8 w-8" />
            </button>
          </div>
        )}
        {isEdit && <Edit />}
        {openComments && <Comments postId={post.id} />}
      </div>
      {openMenu && (
        <PostMenu ref={menuRef as Ref<HTMLDivElement>}>
          <PostMenuButton onClick={toggleEdit}>
            {isPreview ? "Edit" : "Cancel edit"}
          </PostMenuButton>
          <PostMenuButton onClick={handleDelete}>Delete</PostMenuButton>
          <PostMenuButton onClick={reportPost}>report</PostMenuButton>
        </PostMenu>
      )}
      {openConfirm && (
        <div
          className="fixed inset-0 z-50 flex h-screen w-screen items-center justify-center bg-black bg-opacity-20"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setOpenConfirm(false);
            }
          }}
        >
          <div className="z-50 mx-4 flex h-max w-full max-w-xl flex-col gap-4 rounded-md bg-white p-4 shadow-md">
            <header>
              <p className="text-2xl font-semibold">Are you sure?</p>
              <p>To delete this post</p>
            </header>
            <footer className="flex w-full items-center justify-end gap-2">
              <Button variant="secondary" className="p-2" onClick={cancelEdit}>
                cancel
              </Button>
              <Button
                variant="error"
                className="p-2"
                isLoading={isDeleting}
                onClick={deletePost}
              >
                delete
              </Button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
};

export const Post = (props: Props) => {
  return (
    <PostProvider {...props}>
      <BasePost />
    </PostProvider>
  );
};
