import Image from "next/image";
import resetPasswordImage from "src/assets/reset-password.svg";
import resetPasswordBackground from "src/assets/background/reset-password.svg";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { Button } from "src/components/common/Button";
import { FormGroup } from "src/components/common/FormGroup";
import { Input } from "src/components/common/Input";
import { Label } from "src/components/common/Label";
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
        password: z.string().min(8, "Password must be at least 8 characters"),
        passwordConfirmation: z
          .string()
          .min(8, "Password must be at least 8 characters"),
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
    <div className="flex h-screen w-screen items-center justify-center">
      <Image
        className="-z-1 relative"
        fill
        src={resetPasswordBackground}
        alt="Forgot password background"
      />
      <div className="align-center relative z-10 mx-auto flex h-max w-full max-w-3xl flex-col rounded-md bg-white bg-opacity-25 p-4 shadow-md backdrop-blur-md md:justify-center">
        <Image
          src={resetPasswordImage}
          alt="Forgot password"
          width={300}
          height={300}
        />
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
          <FormGroup>
            <Label>New password</Label>
            {errors.password && (
              <p className="m-0 p-0 text-xs text-red-500">
                {errors.password.message as string}
              </p>
            )}
            <Input
              type="password"
              {...register("password")}
              error={Boolean(errors.password)}
            ></Input>
          </FormGroup>
          <FormGroup>
            <Label>Confirm password</Label>
            {errors.passwordConfirmation && (
              <p className="m-0 p-0 text-xs text-red-500">
                {errors.passwordConfirmation.message as string}
              </p>
            )}
            <Input
              type="password"
              {...register("passwordConfirmation")}
              error={Boolean(errors.passwordConfirmation)}
            ></Input>
          </FormGroup>
          <Button variant="secondary" className="mt-2">
            Reset password
          </Button>
        </form>
      </div>
    </div>
  );
}
