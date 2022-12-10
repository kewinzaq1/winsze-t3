import { Input } from "src/components/common/Input";
import { trpc } from "src/utils/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { FormGroup } from "src/components/common/FormGroup";
import { Label } from "src/components/common/Label";
import { GiFlyingDagger } from "react-icons/gi";
import { Button } from "src/components/common/Button";
import Image from "next/image";
import { comment } from "postcss";
import { useSession } from "next-auth/react";
import avatarPlaceholder from "src/images/avatar_placeholder.png";
import { ErrorMessage } from "src/components/common/ErrorMessage";
import { useQueryClient } from "@tanstack/react-query";

export const CreateComment = ({ postId }: { postId: string }) => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  const { mutate: addComment } = trpc.posts.addComment.useMutation({
    onMutate: async (newComment) => {
      const QUERY = [
        ["posts", "getPostComments"],
        {
          input: {
            postId,
          },
          type: "query",
        },
      ];

      const name = session?.user?.name;
      const email = session?.user?.email;
      const image = session?.user?.image;
      const id = session?.user?.id;

      const comment = { ...newComment, user: { name, email, image, id } };

      await queryClient.cancelQueries(QUERY);

      queryClient.setQueryData(QUERY, (oldData) => {
        return [...(oldData as []), comment];
      });
    },
  });

  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(
      z.object({
        content: z.string(),
      })
    ),
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = handleSubmit((data) => {
    addComment({
      postId,
      ...data,
    });
  });

  return (
    <form onSubmit={onSubmit}>
      <FormGroup>
        <Label>Add comment:</Label>
        {errors.content && (
          <ErrorMessage>{errors.content.message}</ErrorMessage>
        )}
        <div className="flex items-center gap-2">
          <Image
            src={session?.user?.image ?? avatarPlaceholder}
            width={50}
            height={50}
            className="h-12 w-12 rounded-full"
            alt={`avatar ${
              session?.user?.name || session?.user?.email?.split("@")[0]
            }`}
          />
          <Input
            placeholder="You comment here!"
            {...register("content")}
            className="h-max max-h-48 w-full "
            error={Boolean(errors.content)}
          ></Input>
          <Button className="w-max">
            <GiFlyingDagger />
          </Button>
        </div>
      </FormGroup>
    </form>
  );
};
