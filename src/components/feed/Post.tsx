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
import { Button } from "../common/Button";
import { GiFlyingDagger } from "react-icons/gi";
import { imgToBase64 } from "src/utils/imgToBase64";
import { Textarea } from "../common/Textarea";
import { useSession } from "next-auth/react";
import { useClickAway } from "src/hooks/useClickAway";
import { PostMenu } from "./PostMenu";
import { PostMenuButton } from "./PostMenuButton";

export const Post = (post: RouterOutputs["posts"]["getPosts"][number]) => {
  const utils = trpc.useContext();
  const [openMenu, setOpenMenu] = useState(false);
  const handleMenu = () => setOpenMenu((c) => !c);
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
    console.log(image);
    console.log(values);
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
            width={1920}
            height={1080}
            src={image}
            alt={image}
            className="mt-2 h-full w-full object-contain"
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
    <div className="relative flex w-full select-none flex-col rounded-md p-4 shadow-md">
      <div className="flex py-2">
        <Image
          src={`${post.user.image}`}
          width={50}
          height={50}
          alt={`${post.user.name}`}
          className="rounded-full object-cover"
        />
        <div className="ml-2 flex flex-col">
          <p className="text-sm  opacity-40">{post.user.email}</p>
          <p className="text-xl font-light">
            {post.user.name || post.user.email?.split("@")[0]}
          </p>
        </div>
        {isAuthor && (
          <BiDotsHorizontalRounded
            className="pointer absolute top-4 right-4 h-8 w-8"
            role="button"
            tabIndex={0}
            aria-label="manage post"
            title="manage post"
            onClick={handleMenu}
          />
        )}
      </div>
      <div className="mt-2 flex flex-col">
        {isPreview && <p className="text-2xl">{post.content}</p>}
        {post.image && isPreview && (
          <Image
            width={1920}
            height={1080}
            src={post.image}
            alt={post.content}
            className="mt-2 h-max w-full rounded-md object-cover"
          />
        )}
        {isPreview && (
          <div className="flex items-center">
            <button>like</button>
            <button>comment</button>
            <button>share</button>
          </div>
        )}
        {isEdit && Edit}
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
          <PostMenuButton>remove</PostMenuButton>
          <PostMenuButton>report</PostMenuButton>
          <PostMenuButton>unpublish</PostMenuButton>
        </PostMenu>
      )}
    </div>
  );
};
