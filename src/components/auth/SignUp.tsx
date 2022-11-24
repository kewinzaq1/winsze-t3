import { BsFacebook, BsGoogle } from "react-icons/bs";
import { AuthFormGroup } from "./AuthFormGroup";
import { AuthLabel } from "./AuthLabel";
import { AuthInput } from "./AuthInput";
import { AuthButton } from "./AuthButton";
import { AuthLeftPanel } from "./AuthLeftPanel";
import { trpc } from "src/utils/trpc";
import { registerSchema } from "src/zod/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

export const SignUp = () => {
  const [mode, setMode] = useState<"login" | "register">("register");
  const [loginError, setLoginError] = useState<string | null>(null);
  const { mutate, isLoading, error } = trpc.auth.register.useMutation();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (data: any) => {
    if (mode === "register") {
      mutate(data);
      return;
    }
    const response = await signIn("credentials", { ...data, redirect: false });
    if (!response?.ok) {
      setLoginError(response?.error as string);
    } else {
      router.push("/");
      return;
    }
  };

  const handleModeChange = () => {
    setMode((prev) => (prev === "login" ? "register" : "login"));
  };

  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center p-4 lg:flex-row">
      <AuthLeftPanel />
      <div className="flex h-3/4 w-full flex-col px-10 py-4 lg:w-3/4">
        <div>
          <h2 className="text-2xl font-semibold">Sign up</h2>
          <p>
            Already have an account?{" "}
            <a href="#" className="font-bold" onClick={handleModeChange}>
              {mode === "login" ? "Sign in" : "Sign up"}
            </a>
          </p>
        </div>
        <div className="mt-10 flex flex-col">
          <p className="col-span-2 mb-2 text-sm text-slate-600">
            Other methods?
          </p>
          <div className="flex items-center gap-2">
            <AuthButton
              variant="secondary"
              onClick={async () => {
                const res = await signIn("google");
                console.log(res);
              }}
            >
              <BsGoogle className="mr-2 text-xl" />
              Google
            </AuthButton>
            <AuthButton
              variant="secondary"
              onClick={async () => {
                const res = await signIn("facebook");
                console.log(res);
              }}
            >
              <BsFacebook className="mr-2 text-xl" />
              Facebook
            </AuthButton>
          </div>
        </div>
        <form className="mt-10" onSubmit={handleSubmit(onSubmit)}>
          {(error || loginError) && (
            <p className="m-0 p-0 text-sm text-red-500">
              {error?.message || loginError}
            </p>
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
          </AuthFormGroup>
          <AuthFormGroup>
            <AuthLabel htmlFor="role">Role</AuthLabel>
            <AuthInput
              id="role"
              {...register("role")}
              error={Boolean(errors.role)}
            />
          </AuthFormGroup>
          <AuthButton
            className="mt-6"
            type="submit"
            variant={isLoading ? "primary" : "secondary"}
          >
            {isLoading ? (
              <>
                <Image
                  src="/svg/oval.svg"
                  alt="loading oval"
                  role="progressbar"
                  width={20}
                  height={10}
                  color="red"
                  className="mr-2"
                />
                <p className="text-violetSecondary">Loading</p>
              </>
            ) : mode === "login" ? (
              "Sign in"
            ) : (
              "Sign up"
            )}
          </AuthButton>
        </form>
      </div>
    </main>
  );
};
