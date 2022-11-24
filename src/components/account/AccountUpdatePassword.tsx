import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AuthButton } from "src/components/auth/AuthButton";
import { AuthFormGroup } from "src/components/auth/AuthFormGroup";
import { AuthInput } from "src/components/auth/AuthInput";
import { AuthLabel } from "src/components/auth/AuthLabel";
import { trpc } from "src/utils/trpc";
import { z } from "zod";

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
        currentPassword: z.string().min(8),
        newPassword: z.string().min(8),
      })
    ),
  });

  const onSubmit = (value: any) => {
    console.log(value);
    mutate(value);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full flex-col items-start"
    >
      {error && <p>{error.message}</p>}
      {isLoading && <p>Loading...</p>}
      <AuthFormGroup className="w-full">
        <AuthLabel>Current Password</AuthLabel>
        {errors.currentPassword && (
          <p className="m-0 p-0 text-xs text-red-500">
            {errors.currentPassword.message as string}
          </p>
        )}
        <AuthInput
          className="w-full"
          type="password"
          placeholder="Current password"
          {...register("currentPassword")}
          error={Boolean(errors.currentPassword)}
        />
      </AuthFormGroup>
      <AuthFormGroup className="w-full">
        <AuthLabel>New Password</AuthLabel>
        {errors.newPassword && (
          <p className="m-0 p-0 text-xs text-red-500">
            {errors.newPassword.message as string}
          </p>
        )}
        <AuthInput
          className="w-full"
          type="password"
          placeholder="New Password"
          {...register("newPassword")}
          error={Boolean(errors.newPassword)}
        />
      </AuthFormGroup>
      <AuthButton
        type="submit"
        className="mt-5 w-full text-center"
        isLoading={isLoading}
        variant={isLoading ? "primary" : "secondary"}
      >
        Update
      </AuthButton>
    </form>
  );
}
