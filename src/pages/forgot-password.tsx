import Image from "next/image";
import forgotPasswordImage from "src/assets/forgot-password.svg";
import forgotPasswordBackground from "src/assets/background/forgot-password.svg";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AuthButton } from "src/components/common/Button";
import { AuthFormGroup } from "src/components/common/FormGroup";
import { AuthInput } from "src/components/common/Input";
import { AuthLabel } from "src/components/common/Label";
import { trpc } from "src/utils/trpc";
import { z } from "zod";
import { useMemo } from "react";

export default function ForgotPasswordPage() {
  const { mutate, isLoading, isError } =
    trpc.auth.sendResetPasswordToken.useMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(
      z.object({ email: z.string().email("Email is required!") })
    ),
    defaultValues: {
      email: "",
    },
  });

  const buttonVariant = useMemo(() => {
    if (isLoading) return "info";
    if (isError) return "error";
    return "secondary";
  }, [isLoading, isError]);

  const onSubmit = handleSubmit((values) => {
    mutate(values);
  });

  return (
    <div className="flex h-screen w-screen items-center">
      <Image
        className="-z-1 relative"
        fill
        src={forgotPasswordBackground}
        alt="Forgot password background"
      />
      <div className="align-center relative z-10 mx-auto flex h-max w-full max-w-3xl flex-col rounded-md bg-white bg-opacity-25 p-4 shadow-md backdrop-blur-md md:justify-center">
        <Image
          src={forgotPasswordImage}
          alt="Forgot password"
          width={300}
          height={300}
        />
        <h1 className="mb-4 text-3xl font-bold">Forgot password?</h1>
        <p>Enter your email, then we will send link to reset</p>
        <form onSubmit={onSubmit} className="w-full">
          <AuthFormGroup className="w-full">
            {errors.email && (
              <p className="m-0 p-0 text-sm text-red-500">
                {errors.email.message}
              </p>
            )}
            <AuthLabel className="w-full">Email</AuthLabel>
            <AuthInput {...register("email")} className="w-full"></AuthInput>
            <AuthButton
              variant={buttonVariant}
              className="mt-2"
              isLoading={isLoading}
            >
              Send email
            </AuthButton>
          </AuthFormGroup>
        </form>
      </div>
    </div>
  );
}
