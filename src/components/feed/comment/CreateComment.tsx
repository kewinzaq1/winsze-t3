import { Input } from "src/components/common/Input";
import { trpc } from "src/utils/trpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { FormGroup } from "src/components/common/FormGroup";
import { Label } from "src/components/common/Label";
import { GiFlyingDagger } from "react-icons/gi";
import { Button } from "src/components/common/Button";

export const CreateComment = ({ postId }: { postId: string }) => {
  const { mutate: addComment } = trpc.posts.addComment.useMutation({});

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
        <Label>Comment</Label>
        <Input placeholder="You comment here!" {...register("content")}></Input>
        <Button>
          <GiFlyingDagger />
        </Button>
      </FormGroup>
    </form>
  );
};
