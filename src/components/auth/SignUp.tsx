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

export const SignUp = () => {
  const queryRegister = trpc.auth.register.useQuery;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: any) => {
    console.log(data);
  };

  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center p-4 lg:flex-row">
      <AuthLeftPanel />
      <div className="flex h-3/4 w-full flex-col px-10 py-4 lg:w-3/4">
        <div>
          <h2 className="text-2xl font-semibold">Sign up</h2>
          <p>
            Already have an account?{" "}
            <a href="#" className="font-bold">
              Log in
            </a>
          </p>
        </div>
        <div className="mt-10 flex flex-col">
          <p className="col-span-2 mb-2 text-sm text-slate-600">
            Other methods?
          </p>
          <div className="flex items-center gap-2">
            <AuthButton variant="secondary">
              <BsGoogle className="mr-2 text-xl" />
              Google
            </AuthButton>
            <AuthButton variant="secondary">
              <BsFacebook className="mr-2 text-xl" />
              Facebook
            </AuthButton>
          </div>
        </div>
        <form className="mt-10" onSubmit={handleSubmit(onSubmit)}>
          <AuthFormGroup>
            <AuthLabel htmlFor="email">Email</AuthLabel>
            <AuthInput
              id="email"
              placeholder="john@doe.com"
              {...register("email")}
              className={`${errors.email ? "border-red-500" : ""}`}
            />
          </AuthFormGroup>
          <AuthFormGroup>
            <AuthLabel htmlFor="password">Password</AuthLabel>
            <AuthInput
              id="password"
              type="password"
              {...register("password")}
              className={`${errors.password ? "border-red-500" : ""}`}
            />
          </AuthFormGroup>
          <AuthFormGroup>
            <AuthLabel htmlFor="role">Role</AuthLabel>
            <AuthInput
              id="role"
              {...register("role")}
              className={`${errors.role ? "border-red-500" : ""}`}
            />
          </AuthFormGroup>
          <AuthButton className="mt-6" type="submit">
            Create account
          </AuthButton>
        </form>
      </div>
    </main>
  );
};
