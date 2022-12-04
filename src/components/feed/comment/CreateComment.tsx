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

export const CreateComment = ({ postId }: { postId: string }) => {
  const { mutate: addComment } = trpc.posts.addComment.useMutation({});
  const { data: session } = useSession();

  const { register, handleSubmit, resetField } = useForm({
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
        <div className="flex items-center gap-2">
          <Image
            src={session?.user?.image ?? avatarPlaceholder}
            width={50}
            height={50}
            className="h-8 w-8 rounded-full"
            alt={`avatar ${
              session?.user?.name || session?.user?.email?.split("@")[0]
            }`}
          />
          <Label>Add comment:</Label>
        </div>
        <Input
          placeholder="You comment here!"
          {...register("content")}
          className="h-max max-h-48 "
        ></Input>
        <Button className="w-max">
          <GiFlyingDagger />
        </Button>
      </FormGroup>
    </form>
  );
};
