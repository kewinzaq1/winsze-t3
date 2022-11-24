import { TestimonialsSlider } from "./TestimonialsSilder";
import { BsFacebook, BsGoogle } from "react-icons/bs";

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
            <button className="duration-250 col-start-1 flex w-max items-center gap-2 rounded-md border border-violetPrimary bg-slate-50 p-4 outline-none transition hover:bg-violetPrimary hover:text-slate-50 focus:bg-violetPrimary focus:text-slate-50 active:scale-95">
              <BsGoogle className="text-xl" />
              Google
            </button>
            <button className="duration-250 col-start-2 flex w-max items-center gap-2 rounded-md border border-violetPrimary bg-slate-50 p-4 outline-none transition hover:bg-violetPrimary hover:text-slate-50 focus:bg-violetPrimary focus:text-slate-50 active:scale-95">
              <BsFacebook className="text-xl" />
              Facebook
            </button>
          </div>
        </div>
        <form className="mt-10">
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-slate-600">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="rounded-md border border-slate-400 bg-white p-2 outline-none focus:border-violetPrimary"
            />
          </div>
          <div className="mt-6 flex flex-col gap-1">
            <label htmlFor="password" className="text-slate-600">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              className="rounded-md border border-slate-400 bg-white p-2 outline-none focus:border-violetPrimary"
            />
          </div>
          <div className="mt-6 flex flex-col gap-1">
            <label htmlFor="role" className="text-slate-600">
              Role
            </label>
            <input
              type="text"
              name="role"
              id="role"
              className="rounded-md border border-slate-400 bg-white p-2 outline-none focus:border-violetPrimary"
            />
          </div>
          <button
            type="submit"
            className="mt-6 rounded-md border bg-violetPrimary p-4 text-white outline-none transition hover:border-violetPrimary hover:bg-slate-50 hover:text-violetPrimary focus:border-violetPrimary focus:bg-slate-50 focus:text-violetPrimary active:scale-95"
          >
            Create account
          </button>
        </form>
      </div>
    </main>
  );
};
