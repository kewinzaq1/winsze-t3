import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { addPostSchema } from "src/server/trpc/router/posts";
import { trpc } from "src/utils/trpc";
import { Button } from "../common/Button";
import { Input } from "../common/Input";

export const CreatePost = () => {
  const { mutate } = trpc.posts.addPost.useMutation();

  const {
    formState: { errors },
    register,
    handleSubmit,
  } = useForm({
    resolver: zodResolver(addPostSchema),
    defaultValues: {
      title: "",
      content: "",
      image: "",
    },
  });

  return (
    <div>
      <form onSubmit={handleSubmit((data) => mutate(data))}>
        <Input {...register("title")} error={Boolean(errors.title)} />
        <Input {...register("content")} error={Boolean(errors.content)} />
        <Input
          {...register("image")}
          error={Boolean(errors.image)}
          type="image"
        />
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
};
