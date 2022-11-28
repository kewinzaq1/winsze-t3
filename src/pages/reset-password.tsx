import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { AuthButton } from "src/components/auth/AuthButton";
import { AuthFormGroup } from "src/components/auth/AuthFormGroup";
import { AuthInput } from "src/components/auth/AuthInput";
import { AuthLabel } from "src/components/auth/AuthLabel";
import { trpc } from "src/utils/trpc";
import { z } from "zod";

export default function ResetPasswordPage() {
  const router = useRouter();
  const token = router.query.token as string;

  const { mutate, error } = trpc.auth.resetPassword.useMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(
      z.object({
        password: z.string().min(8),
        passwordConfirmation: z.string().min(8),
      })
    ),
    defaultValues: {
      password: "",
      passwordConfirmation: "",
    },
  });

  const onSubmit = handleSubmit((values) => {
    mutate({ ...values, token });
  });

  return (
    <div className="flex flex-col">
      <h1 className="mb-4 text-3xl font-bold">Reset password</h1>
      <form onSubmit={onSubmit}>
        {error && (
          <div
            className="relative mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700"
            role="alert"
          >
            <strong className="mr-1 font-bold">Error!</strong>
            <span className="block sm:inline">{error.message}</span>
          </div>
        )}
        <AuthFormGroup>
          <AuthLabel>New password</AuthLabel>
          <AuthInput
            type="password"
            {...register("password")}
            error={Boolean(errors.password)}
          ></AuthInput>
        </AuthFormGroup>
        <AuthFormGroup>
          <AuthLabel>Confirm password</AuthLabel>
          <AuthInput
            type="password"
            {...register("passwordConfirmation")}
            error={Boolean(errors.passwordConfirmation)}
          ></AuthInput>
          <AuthButton>Reset password</AuthButton>
        </AuthFormGroup>
      </form>
    </div>
  );
}
