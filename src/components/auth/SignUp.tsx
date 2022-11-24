import { TestimonialsSlider } from "./TestimonialsSilder";
import { BsFacebook, BsGoogle } from "react-icons/bs";
import { AuthFormGroup } from "./AuthFormGroup";
import { AuthLabel } from "./AuthLabel";
import { AuthInput } from "./AuthInput";
import { AuthButton } from "./AuthButton";

export const SignUp = () => {
  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center p-4 lg:flex-row">
      <div className="hidden h-full w-1/4 flex-col justify-between rounded-md bg-violetPrimary px-4 py-10 text-white shadow-sm lg:flex">
        <p className="text-xl font-normal">Winsze - T3</p>
        <div className="flex flex-col">
          <h1 className="text-4xl">Start your journey with us.</h1>
          <p className="lg:font-2xl mt-4 font-extralight">
            Discover the world&apos;s best community of freelancers and business
            owners
          </p>
        </div>
        <TestimonialsSlider />
      </div>
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
              <BsGoogle className="text-xl" />
              Google
            </AuthButton>
            <AuthButton>
              <BsFacebook className="text-xl" />
              Facebook
            </AuthButton>
          </div>
        </div>
        <form className="mt-10">
          <AuthFormGroup>
            <AuthLabel htmlFor="email">Email</AuthLabel>
            <AuthInput id="email" placeholder="john@doe.com" />
          </AuthFormGroup>
          <AuthFormGroup>
            <AuthLabel htmlFor="password">Password</AuthLabel>
            <AuthInput id="password" type="password" />
          </AuthFormGroup>
          <AuthFormGroup>
            <AuthLabel htmlFor="role">Role</AuthLabel>
            <AuthInput id="role" />
          </AuthFormGroup>
          <AuthButton>Create account</AuthButton>
        </form>
      </div>
    </main>
  );
};
