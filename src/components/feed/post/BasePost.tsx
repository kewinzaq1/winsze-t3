import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import type { LegacyRef, Ref } from "react";
import { useCallback } from "react";
import {
  AiFillHeart,
  AiOutlineComment,
  AiOutlineHeart,
  AiOutlineShareAlt,
} from "react-icons/ai";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { Comments } from "../comment/Comments";
import { PostMenu } from "./PostMenu";
import { PostMenuButton } from "./PostMenuButton";
import avatarPlaceholder from "src/images/avatar_placeholder.png";
import { usePost } from "./PostContext";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { PostConfirmationMenu } from "./ConfirmationMenu";
import { PostEdit } from "./PostEdit";

export const BasePost = () => {
  const {
    isAuthor,
    isEdit,
    isPreview,
    openMenu,
    openConfirm,
    openComments,
    setOpenMenu,
    setOpenConfirm,
    setOpenComments,
    menuRef,
    userLike,
    toggleLike,
    reportPost,
    saveLink,
    setMode,
    post,
    setImage,
    setValue,
  } = usePost();

  const cancelEdit = useCallback(() => {
    setMode("preview");
    setOpenComments(false);
    setOpenMenu(false);
    setImage(post.image || "");
    setValue("content", post.content);
  }, [
    post.content,
    post.image,
    setImage,
    setMode,
    setOpenComments,
    setOpenMenu,
    setValue,
  ]);

  const toggleEdit = useCallback(() => {
    setMode("edit");
    setOpenComments(false);
    setOpenMenu(false);
  }, [setMode, setOpenComments, setOpenMenu]);

  const handleDelete = useCallback(() => {
    setOpenConfirm(true);
  }, [setOpenConfirm]);

  const handleMenu = useCallback(() => {
    setOpenMenu((c) => !c);
  }, [setOpenMenu]);

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
            className="absolute top-4 right-4 h-8 w-8 cursor-pointer"
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
        {isEdit && <PostEdit />}
        {openComments && <Comments postId={post.id} />}
      </div>
      {openMenu && (
        <PostMenu ref={menuRef as Ref<HTMLDivElement>}>
          <PostMenuButton onClick={isPreview ? toggleEdit : cancelEdit}>
            {isPreview ? "Edit" : "Cancel edit"}
          </PostMenuButton>
          <PostMenuButton onClick={handleDelete}>Delete</PostMenuButton>
          <PostMenuButton onClick={reportPost}>report</PostMenuButton>
        </PostMenu>
      )}
      {openConfirm && <PostConfirmationMenu />}
    </div>
  );
};
