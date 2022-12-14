import { FormGroup } from "../common/FormGroup";
import { Label } from "../common/Label";
import { Input } from "../common/Input";
import { Button } from "../common/Button";
import { AuthLeftPanel } from "./AuthLeftPanel";
import { trpc } from "src/utils/trpc";
import { registerSchema } from "src/zod/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import { AuthOtherMethods } from "./AuthOtherMethods";
import background from "src/assets/background/auth-left.svg";
import Image from "next/image";
import { useNotifier } from "../notifier";

export const SignUp = () => {
  const { show } = useNotifier();
  const { mutateAsync, isLoading, error } = trpc.auth.register.useMutation({
    onSuccess: () => {
      show({
        message: "Success",
        description: "Account created successfully",
        type: "success",
      });
    },
    onError: (error) => {
      show({
        message: "Error",
        description: error.message,
        type: "error",
      });
    },
  });
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
    router.push("/");
  }

  const onSubmit = handleSubmit(async (data) => {
    await mutateAsync(data);
    router.push("/");
  });

  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center p-4 lg:flex-row">
      <AuthLeftPanel />
      <Image
        src={background}
        alt="group of people who are working together"
        className="absolute -z-10 h-screen w-screen object-cover opacity-30"
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
        <form className="mt-10 flex flex-col gap-2" onSubmit={onSubmit}>
          {error && (
            <p className="m-0 p-0 text-sm text-red-500">{error?.message}</p>
          )}
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
          </FormGroup>
          <FormGroup>
            <Label htmlFor="role">Role</Label>
            <Input id="role" {...register("role")} error={errors.role} />
          </FormGroup>
          <Button className="mt-6 w-max" type="submit" isLoading={isLoading}>
            Sign up
          </Button>
        </form>
      </div>
    </main>
  );
};
