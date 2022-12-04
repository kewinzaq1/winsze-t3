import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { trpc } from "src/utils/trpc";
import { Button } from "../../common/Button";
import { Input } from "../../common/Input";
import { z } from "zod";
import { imgToBase64 } from "src/utils/imgToBase64";
import { FcStackOfPhotos } from "react-icons/fc";
import { GiFlyingDagger } from "react-icons/gi";
import { IoMdRemoveCircle } from "react-icons/io";
import type { LegacyRef } from "react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Textarea } from "../../common/Textarea";
import { useNotifier } from "../../notifier";

export const CreatePost = () => {
  const { show } = useNotifier();

  const utils = trpc.useContext();
  const { mutate, data, error, isLoading } = trpc.posts.addPost.useMutation({
    onSuccess: () => {
      resetField("content");
      resetField("image");
      setImage("");
      utils.posts.getPosts.invalidate({});
      show({
        message: "Post created",
        description: "Your post has been created successfully",
        type: "success",
        duration: 3000,
      });
    },
    onError: (err) => {
      show({
        message: err.message,
        description: err?.message,
        type: "error",
        duration: 3000,
      });
    },
  });
  const [parentRef] = useAutoAnimate();

  const [image, setImage] = useState("");

  useEffect(() => {
    console.log("unnecesrary changes", image);
  }, [image]);

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
      mutate({ content: values.content });
      return;
    }
    const image = await imgToBase64(values.image[0] as File);
    mutate({
      content: values.content,
      image: image as string,
    });
  });

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

  console.log(errors);

  return (
    <div className="pt-24">
      {error && (
        <div className="border-2 border-red-500 bg-red-300 p-4 text-sm text-red-500">
          {error.message}
        </div>
      )}
      <form
        ref={parentRef as LegacyRef<HTMLFormElement>}
        onSubmit={onSubmit}
        className="min-h-64 relative mx-auto w-full max-w-3xl rounded-md p-4 shadow-md outline-none backdrop-blur-sm focus:border-transparent focus:outline-none focus:ring-1 focus:ring-violetPrimary"
      >
        <label htmlFor="photo">
          <FcStackOfPhotos
            role="button"
            tabIndex={0}
            className="absolute right-4 bottom-4 h-12 w-12"
            title="pick a photo"
          />
        </label>
        {Boolean(image.length) && (
          <IoMdRemoveCircle
            onClick={clearImage}
            role="button"
            tabIndex={0}
            aria-label="remove photo"
            className="absolute right-20 bottom-4 h-12 w-12 text-red-500"
          />
        )}
        <Textarea
          maxLength={255}
          placeholder="What is on your mind?"
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
