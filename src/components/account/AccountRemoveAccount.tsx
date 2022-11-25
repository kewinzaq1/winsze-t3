import { zodResolver } from "@hookform/resolvers/zod";
import { signOut } from "next-auth/react";
import { useForm } from "react-hook-form";
import { AuthButton } from "src/components/auth/AuthButton";
import { AuthFormGroup } from "src/components/auth/AuthFormGroup";
import { AuthInput } from "src/components/auth/AuthInput";
import { AuthLabel } from "src/components/auth/AuthLabel";
import { trpc } from "src/utils/trpc";
import { z } from "zod";

export function AccountRemoveAccount() {
  const { mutate, isLoading, error } = trpc.account.removeAccount.useMutation({
    onSuccess: () => {
      signOut({ callbackUrl: "/sign-in" });
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(
      z.object({
        password: z.string().min(8),
      })
    ),
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (value: any) => {
    mutate(value);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="relative mt-4 flex h-full w-full flex-col items-start"
    >
      <h2 className="text-2xl font-semibold">Remove account</h2>
      {error && (
        <p className="absolute top-8 m-0 p-0 text-sm text-red-500">
          {error.message}
        </p>
      )}
      <AuthFormGroup className="w-full">
        <AuthLabel>Confirm password</AuthLabel>
        {errors.password && (
          <p className="m-0 p-0 text-xs text-red-500">
            {errors.password.message as string}
          </p>
        )}
        <AuthInput
          className="w-full"
          type="password"
          placeholder="Password"
          {...register("password")}
          error={Boolean(errors.password)}
        />
      </AuthFormGroup>
      <AuthButton
        type="submit"
        className="mt-5 w-full text-center"
        isLoading={isLoading}
        variant={isLoading ? "primary" : "secondary"}
      >
        Remove account
      </AuthButton>
    </form>
  );
}
