import { AuthFormGroup } from "./AuthFormGroup";
import { AuthLabel } from "./AuthLabel";
import { AuthInput } from "./AuthInput";
import { AuthButton } from "./AuthButton";
import { AuthLeftPanel } from "./AuthLeftPanel";
import { registerSchema } from "src/zod/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import { AuthOtherMethods } from "./AuthOtherMethods";

export const SignIn = () => {
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const session = useSession();

  useEffect(() => {
    if (session.status === "authenticated") {
      router.push("/");
    }
  }, [router, session.status]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  if (session.status === "authenticated") {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any) => {
    setIsLoading(true);
    const response = await signIn("credentials", { ...data, redirect: false });
    setIsLoading(false);
    if (!response?.ok) {
      setLoginError(response?.error as string);
    } else {
      router.push("/");
      return;
    }
  };

  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center p-4 lg:flex-row">
      <AuthLeftPanel />
      <div className="flex h-3/4 w-full flex-col px-10 py-4 lg:w-3/4">
        <div>
          <h2 className="text-2xl font-semibold">Sign up</h2>
          <p>
            <span className="mr-1">Already have an account?</span>
            <Link href="sign-up" className="font-bold">
              Sign in
            </Link>
          </p>
        </div>
        <AuthOtherMethods />
        <form className="mt-10" onSubmit={handleSubmit(onSubmit)}>
          {loginError && (
            <p className="m-0 p-0 text-sm text-red-500">{loginError}</p>
          )}
          <AuthFormGroup>
            <AuthLabel htmlFor="email">Email</AuthLabel>
            {errors.email && (
              <p className="m-0 p-0 text-xs text-red-500">Invalid email!</p>
            )}
            <AuthInput
              id="email"
              placeholder="john@doe.com"
              {...register("email")}
              error={Boolean(errors.email)}
            />
          </AuthFormGroup>
          <AuthFormGroup>
            <AuthLabel htmlFor="password">Password</AuthLabel>
            {errors.password && (
              <p className="m-0 p-0 text-xs text-red-500">
                Invalid password! (min length 8 char.)
              </p>
            )}
            <AuthInput
              id="password"
              type="password"
              {...register("password")}
              error={Boolean(errors.password)}
            />
            <Link
              href="forgot-password"
              className="text-sm font-bold text-slate-700"
            >
              Forgot password?
            </Link>
          </AuthFormGroup>
          <AuthButton
            className="mt-6"
            type="submit"
            variant={isLoading ? "primary" : "secondary"}
            isLoading={isLoading}
          >
            Sign in
          </AuthButton>
        </form>
      </div>
    </main>
  );
};
