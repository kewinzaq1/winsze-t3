import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AuthButton } from "src/components/auth/AuthButton";
import { AuthFormGroup } from "src/components/auth/AuthFormGroup";
import { AuthInput } from "src/components/auth/AuthInput";
import { AuthLabel } from "src/components/auth/AuthLabel";
import { trpc } from "src/utils/trpc";
import { z } from "zod";

export default function AccountPage() {
  const { mutate, isLoading, error } =
    trpc.account.updatePassword.useMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(
      z.object({ currentPassword: z.string(), newPassword: z.string() })
    ),
  });

  const onSubmit = (value: any) => {
    console.log(value);
    mutate(value);
  };

  return (
    <div className="mx-auto grid max-w-7xl md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-start border border-red-500"
      >
        {error && <p>{error.message}</p>}
        {isLoading && <p>Loading...</p>}
        <AuthFormGroup>
          <AuthLabel>Current Password</AuthLabel>
          <AuthInput
            type="password"
            placeholder="Current password"
            {...register("currentPassword")}
          />
        </AuthFormGroup>
        <AuthFormGroup>
          <AuthLabel>New Password</AuthLabel>
          <AuthInput
            type="password"
            placeholder="New Password"
            {...register("newPassword")}
          />
        </AuthFormGroup>
        <AuthButton
          type="submit"
          className="w-full text-center"
          isLoading={isLoading}
        >
          Update
        </AuthButton>
      </form>
    </div>
  );
}
