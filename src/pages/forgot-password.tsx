import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AuthButton } from "src/components/auth/AuthButton";
import { AuthFormGroup } from "src/components/auth/AuthFormGroup";
import { AuthInput } from "src/components/auth/AuthInput";
import { AuthLabel } from "src/components/auth/AuthLabel";
import { trpc } from "src/utils/trpc";
import { z } from "zod";

export default function ForgotPasswordPage() {
  const { mutate } = trpc.auth.sendResetPasswordToken.useMutation();

  const { register, handleSubmit } = useForm({
    resolver: zodResolver(z.object({ email: z.string().email() })),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    console.log(values);
    await mutate(values);
  });

  return (
    <div className="flex flex-col">
      <h1 className="mb-4 text-3xl font-bold">Reset password</h1>
      <form onSubmit={onSubmit}>
        <AuthFormGroup>
          <AuthLabel>Email</AuthLabel>
          <AuthInput type="email" {...register("email")}></AuthInput>
          <AuthButton>Reset password</AuthButton>
        </AuthFormGroup>
      </form>
    </div>
  );
}
