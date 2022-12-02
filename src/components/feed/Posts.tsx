import Image from "next/image";
import type { RouterOutputs } from "src/utils/trpc";
import { trpc } from "src/utils/trpc";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { IoMdRemoveCircle } from "react-icons/io";
import { FcStackOfPhotos } from "react-icons/fc";
import { Button } from "../common/Button";
import { GiFlyingDagger } from "react-icons/gi";
import { imgToBase64 } from "src/utils/imgToBase64";

const Post = (post: RouterOutputs["posts"]["getPosts"][number]) => {
  const [openMenu, setOpenMenu] = useState(false);
  const handleMenu = () => setOpenMenu((c) => !c);
  const [mode, setMode] = useState<"edit" | "preview">("preview");
  const [image, setImage] = useState(post.image ?? "");

  const {
    mutate: editPost,
    error: editError,
    isLoading: isEditLoading,
  } = trpc.posts.editPost.useMutation({
    onSuccess: () => {
      setMode("preview");
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
      editPost({ id: post.id, content: values.content });
      return;
    }
    const image = await imgToBase64(values.image[0] as File);
    editPost({
      id: post.id,
      content: values.content,
      image: image as string,
    });
  });

  return (
    <div className="relative flex w-full select-none flex-col rounded-md p-4 shadow-md">
      <div className="flex">
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
        <BiDotsHorizontalRounded
          className="pointer absolute top-4 right-4 h-8 w-8"
          role="button"
          tabIndex={0}
          aria-label="manage post"
          title="manage post"
          onClick={handleMenu}
        />
      </div>
      <div className="mt-2 flex flex-col">
        {isPreview && <p className="text-3xl">{post.content}</p>}
        {post.image && isPreview && (
          <Image
            width={100}
            height={100}
            src={post.image}
            alt={post.content}
            className="mt-2 h-48 w-full object-contain"
          />
        )}
        {isPreview && (
          <div className="flex items-center">
            <button>like</button>
            <button>comment</button>
            <button>share</button>
          </div>
        )}
        {isEdit && (
          <form onSubmit={onSubmit}>
            {isEdit && (
              <textarea
                maxLength={255}
                placeholder="What is on your mind?"
                {...register("content")}
                className="min-h-3/4 h-max w-full resize-none rounded-md p-4 text-xl outline-none focus:border-transparent focus:outline-none focus:ring-2 focus:ring-violetPrimary"
              />
            )}
            {Boolean(image.length) && isEdit && (
              <>
                <Image
                  width={100}
                  height={100}
                  src={image}
                  alt={image}
                  className="mt-2 h-48 w-full object-contain"
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
        )}
      </div>
      {openMenu && (
        <div className="absolute top-12 right-4 h-max w-24 rounded-md shadow-md">
          <button
            className="w-full p-2 text-left transition hover:bg-slate-100"
            onClick={setEdit}
          >
            edit
          </button>
          <button className="w-full p-2 text-left transition hover:bg-slate-100 ">
            remove
          </button>
          <button className="w-full p-2 text-left transition hover:bg-slate-100 ">
            report
          </button>
          <button className="w-full p-2 text-left transition hover:bg-slate-100 ">
            unpublish
          </button>
        </div>
      )}
    </div>
  );
};

export const Posts = () => {
  const { data } = trpc.posts.getPosts.useQuery({});

  console.log(data);
  return (
    <div className="mx-auto mt-10 w-full max-w-3xl px-4">
      {data?.map((post) => (
        <Post key={post.id} {...post} />
      ))}
    </div>
  );
};
