import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { trpc } from "src/utils/trpc";
import { Button } from "../../common/Button";
import { Input } from "../../common/Input";
import { z } from "zod";
import { imgToBase64 } from "src/utils/imgToBase64";
import { GiFlyingDagger } from "react-icons/gi";
import { TiTimes } from "react-icons/ti";
import type { LegacyRef } from "react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Textarea } from "../../common/Textarea";
import { useNotifier } from "../../notifier";
import { HiOutlinePhotograph } from "react-icons/hi";
import { getUUID } from "src/utils/getUUID";

export const CreatePost = () => {
  const { show } = useNotifier();

  const utils = trpc.useContext();
  const { mutate, error, isLoading } = trpc.posts.addPost.useMutation({
    onSuccess: () => {
      resetField("content");
      resetField("image");
      setImage("");
      utils.posts.getPosts.invalidate({});
      show({
        message: "Post created",
        description: "Your post has been created successfully",
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
  const [parentRef] = useAutoAnimate();

  const [image, setImage] = useState("");

  const {
    formState: { errors },
    register,
    handleSubmit,
    watch,
    resetField,
  } = useForm({
    resolver: zodResolver(
      z.object({
        content: z.string(),
        image: z.any().optional(),
      })
    ),
    defaultValues: {
      content: "",
      image: [] as unknown as FileList,
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    if (!values.image.length) {
      mutate({ content: values.content, id: getUUID() });
      return;
    }
    const image = await imgToBase64({
      image: values.image[0] as File,
      maxWidth: 500,
      maxHeight: 500,
    });
    mutate({
      content: values.content,
      image: image as string,
      id: getUUID(),
    });
  });

  const clearImage = () => {
    setImage("");
    resetField("image");
  };

  useEffect(() => {
    const subscription = watch((value) => {
      if (!value.image?.[0]) {
        return;
      }
      const url = URL.createObjectURL(value.image[0]);
      setImage(url);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <div className="mx-auto mt-24 max-w-xl shadow-md">
      {error && (
        <div className="border-2 border-red-500 bg-red-300 p-4 text-sm text-red-500">
          {error.message}
        </div>
      )}
      <form
        ref={parentRef as LegacyRef<HTMLFormElement>}
        onSubmit={onSubmit}
        className="min-h-64 focus:ring-violetPrimary relative mx-auto w-full max-w-3xl rounded-md p-4 shadow-md outline-none backdrop-blur-sm focus:border-transparent focus:outline-none focus:ring-1"
      >
        <label htmlFor="photo">
          <HiOutlinePhotograph
            role="button"
            tabIndex={0}
            className="absolute right-4 bottom-4 h-6 w-6"
            title="pick a photo"
          />
        </label>
        {Boolean(image.length) && (
          <TiTimes
            color="red"
            onClick={clearImage}
            role="button"
            tabIndex={0}
            aria-label="remove photo"
            className="absolute right-12 bottom-3 h-8 w-8 text-red-500"
          />
        )}
        <Textarea
          maxLength={255}
          placeholder="How's your day going?"
          className="placeholder:text-xl"
          {...register("content")}
        />
        <Input
          id="photo"
          accept="image/*"
          className="hidden"
          {...register("image")}
          error={Boolean(errors.image)}
          type="file"
        />
        {Boolean(image.length) && (
          <Image
            width={500}
            height={500}
            src={image}
            alt={image}
            className="h-[500px] w-full rounded-md object-cover"
          />
        )}
        <Button
          type="submit"
          variant="secondary"
          isLoading={isLoading}
          title="add post"
          aria-label="add post"
          className="mt-4"
        >
          <GiFlyingDagger />
        </Button>
      </form>
    </div>
  );
};
