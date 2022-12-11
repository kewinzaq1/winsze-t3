import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "src/components/common/Button";
import { FormGroup } from "src/components/common/FormGroup";
import { Input } from "src/components/common/Input";
import { Label } from "src/components/common/Label";
import { trpc } from "src/utils/trpc";
import { z } from "zod";

export function AccountUpdateName() {
  const { mutate, isLoading, error } = trpc.account.updateEmail.useMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(
      z.object({
        password: z.string().min(8, "Password must be at least 8 characters"),
        email: z.string().email("Email must be a valid email address"),
      })
    ),
    defaultValues: {
      password: "",
      email: "",
    },
  });

  const onSubmit = handleSubmit((value) => {
    mutate(value);
  });

  return (
    <form
      onSubmit={onSubmit}
      className="relative mt-4 flex h-full w-full flex-col items-start"
    >
      <h2 className="text-2xl font-semibold">Update Email</h2>
      <FormGroup className="w-full">
        <Label>Name</Label>
        <Input
          className="w-full"
          type="password"
          placeholder="Password"
          {...register("password")}
          error={errors.password}
        />
      </FormGroup>
      <FormGroup className="w-full">
        <Label>Password</Label>
        <Input
          className="w-full"
          type="email"
          placeholder="New Email"
          {...register("email")}
          error={errors.email}
        />
      </FormGroup>
      <Button
        type="submit"
        className="mt-5 w-full text-center"
        isLoading={isLoading}
        variant={isLoading ? "primary" : "secondary"}
      >
        Update
      </Button>
    </form>
  );
}
