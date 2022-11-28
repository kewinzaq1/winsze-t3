import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AuthButton } from "src/components/common/Button";
import { AuthFormGroup } from "src/components/common/FormGroup";
import { AuthInput } from "src/components/common/Input";
import { AuthLabel } from "src/components/common/Label";
import { trpc } from "src/utils/trpc";
import { z } from "zod";

export function AccountUpdateEmail() {
  const { mutate, isLoading, error } = trpc.account.updateEmail.useMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(
      z.object({
        password: z.string().min(8),
        email: z.string().email(),
      })
    ),
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (value: any) => {
    console.log(value);
    mutate(value);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="relative mt-4 flex h-full w-full flex-col items-start"
    >
      <h2 className="text-2xl font-semibold">Update Email</h2>
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
      <AuthFormGroup className="w-full">
        <AuthLabel>New Email</AuthLabel>
        {errors.email && (
          <p className="m-0 p-0 text-xs text-red-500">
            {errors.email.message as string}
          </p>
        )}
        <AuthInput
          className="w-full"
          type="email"
          placeholder="New Email"
          {...register("email")}
          error={Boolean(errors.email)}
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
