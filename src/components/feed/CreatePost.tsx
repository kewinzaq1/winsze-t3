import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { trpc } from "src/utils/trpc";
import { addPostSchema } from "src/zod/addPostSchema";
import { Button } from "../common/Button";
import { Input } from "../common/Input";
import { z } from "zod";
import { imgToBase64 } from "src/utils/imgToBase64";

export const CreatePost = () => {
  const { mutate, data, error, isLoading } = trpc.posts.addPost.useMutation();

  const {
    formState: { errors },
    register,
    handleSubmit,
  } = useForm({
    resolver: zodResolver(
      z.object({
        content: z.string(),
        title: z.string(),
        image:
          typeof window !== "undefined"
            ? z
                .instanceof(FileList)
                .refine((val) => val.length > 0, "File is required")
            : z.any(),
      })
    ),
    defaultValues: {
      title: "",
      content: "",
      image: [] as unknown as FileList,
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    if (!values.image.length) {
      mutate({ title: values.title, content: values.content });
      return;
    }
    const image = await imgToBase64(values.image[0] as File);
    mutate({
      title: values.title,
      content: values.content,
      image: image as string,
    });
  });

  return (
    <div className="pt-24">
      {error && (
        <div className="border-2 border-red-500 bg-red-300 p-4 text-sm text-red-500">
          {error.message}
        </div>
      )}
      <form onSubmit={onSubmit}>
        <Input {...register("title")} error={Boolean(errors.title)} />
        <textarea {...register("content")} className="h-40 w-40" />
        <Input
          {...register("image")}
          error={Boolean(errors.image)}
          type="file"
        />
        <Button type="submit" isLoading={isLoading}>
          Submit
        </Button>
      </form>
    </div>
  );
};
