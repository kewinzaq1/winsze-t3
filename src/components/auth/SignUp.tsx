import { FormGroup } from "../common/FormGroup";
import { Label } from "../common/Label";
import { Input } from "../common/Input";
import { Button } from "../common/Button";
import { AuthLeftPanel } from "./AuthLeftPanel";
import { trpc } from "src/utils/trpc";
import { registerSchema } from "src/zod/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import { AuthOtherMethods } from "./AuthOtherMethods";
import background from "src/assets/background/auth-left.svg";
import Image from "next/image";

export const SignUp = () => {
  const {
    mutate,
    isLoading,
    error,
    data: user,
  } = trpc.auth.register.useMutation();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      signIn("email", { email: user.email, redirect: false });
      router.push("/sign-in");
    }
  }, [user, router]);

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
    defaultValues: {
      email: "",
      password: "",
      role: "",
    },
  });

  if (session.status === "authenticated") {
    return null;
  }

  const onSubmit = handleSubmit((data) => {
    mutate(data);
  });

  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center p-4 lg:flex-row">
      <AuthLeftPanel />
      <Image
        src={background}
        layout="fill"
        alt=""
        className="-z-10 object-cover opacity-30"
      />
      <div className="flex h-3/4 w-full flex-col px-10 py-4 lg:w-3/4">
        <div>
          <h2 className="text-2xl font-semibold">Sign up</h2>
          <p>
            <span className="mr-1">Already have an account?</span>
            <Link href="/sign-in" className="font-bold">
              Sign in
            </Link>
          </p>
        </div>
        <AuthOtherMethods />
        <form className="mt-10" onSubmit={onSubmit}>
          {error && (
            <p className="m-0 p-0 text-sm text-red-500">{error?.message}</p>
          )}
          <FormGroup>
            <Label htmlFor="email">Email</Label>
            {errors.email && (
              <p className="m-0 p-0 text-xs text-red-500">Invalid email!</p>
            )}
            <Input
              id="email"
              placeholder="john@doe.com"
              {...register("email")}
              error={Boolean(errors.email)}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="password">Password</Label>
            {errors.password && (
              <p className="m-0 p-0 text-xs text-red-500">
                Invalid password! (min length 8 char.)
              </p>
            )}
            <Input
              id="password"
              type="password"
              {...register("password")}
              error={Boolean(errors.password)}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="role">Role</Label>
            <Input
              id="role"
              {...register("role")}
              error={Boolean(errors.role)}
            />
          </FormGroup>
          <Button
            className="mt-6"
            type="submit"
            variant={isLoading ? "primary" : "secondary"}
            isLoading={isLoading}
          >
            Sign up
          </Button>
        </form>
      </div>
    </main>
  );
};
