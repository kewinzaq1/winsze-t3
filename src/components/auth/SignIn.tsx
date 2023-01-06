import Link from "next/link";

import { FormGroup } from "../common/FormGroup";
import { Label } from "../common/Label";
import { Input } from "../common/Input";
import { Button } from "../common/Button";
import { AuthLeftPanel } from "./AuthLeftPanel";
import { registerSchema } from "src/zod/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { AuthOtherMethods } from "./AuthOtherMethods";
import background from "src/assets/background/auth-left.svg";
import Image from "next/image";
import { useNotifier } from "../notifier";

export const SignIn = () => {
  const { show } = useNotifier();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const session = useSession();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "",
    },
  });

  if (session.status === "authenticated") {
    router.push("/feed");
  }

  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true);
    const response = await signIn("credentials", { ...data, redirect: false });
    setIsLoading(false);
    if (response?.error) {
      show({
        message: "Error",
        description: response.error,
        type: "error",
        placement: "bottomRight",
      });
      router.push("/feed");
    }
  });

  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center p-4 lg:flex-row">
      <AuthLeftPanel />
      <Image
        src={background}
        alt="group of people who are working together"
        className="absolute -z-10 h-screen w-screen object-cover opacity-30"
      />
      <div className="relative z-10 flex h-3/4 w-full flex-col px-10 py-4 lg:w-3/4">
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
        <form className="mt-10 flex w-full flex-col gap-2" onSubmit={onSubmit}>
          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="john@doe.com"
              {...register("email")}
              error={errors.email}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              {...register("password")}
              error={errors.password}
            />
            <Link
              href="forgot-password"
              className="text-sm font-bold text-slate-700"
            >
              Forgot password?
            </Link>
          </FormGroup>
          <Button className="mt-6 w-max" type="submit" isLoading={isLoading}>
            Sign in
          </Button>
        </form>
      </div>
    </main>
  );
};
