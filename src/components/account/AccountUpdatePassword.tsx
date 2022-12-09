import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "src/components/common/Button";
import { FormGroup } from "src/components/common/FormGroup";
import { Input } from "src/components/common/Input";
import { Label } from "src/components/common/Label";
import { trpc } from "src/utils/trpc";
import { z } from "zod";
import { ErrorMessage } from "../common/ErrorMessage";
import { InputError } from "../common/InputError";

export function AccountUpdatePassword() {
  const { mutate, isLoading, error } =
    trpc.account.updatePassword.useMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(
      z.object({
        currentPassword: z
          .string()
          .min(8, "Password must be at least 8 characters long"),
        newPassword: z
          .string()
          .min(8, "Password must be at least 8 characters long"),
      })
    ),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });

  const onSubmit = handleSubmit((value) => {
    mutate(value);
  });

  return (
    <form onSubmit={onSubmit} className="mt-4 flex w-full flex-col items-start">
      <h2 className="text-2xl font-semibold">Update Password</h2>
      {error && <ErrorMessage>{error.message}</ErrorMessage>}
      <FormGroup className="w-full">
        <Label>Current Password</Label>
        {errors.currentPassword && (
          <InputError>{errors.currentPassword.message as string}</InputError>
        )}
        <Input
          className="w-full"
          type="password"
          placeholder="Current password"
          {...register("currentPassword")}
          error={Boolean(errors.currentPassword)}
        />
      </FormGroup>
      <FormGroup className="w-full">
        <Label>New Password</Label>
        {errors.newPassword && (
          <InputError>{errors.newPassword.message as string}</InputError>
        )}
        <Input
          className="w-full"
          type="password"
          placeholder="New Password"
          {...register("newPassword")}
          error={Boolean(errors.newPassword)}
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
