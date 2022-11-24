import { TestimonialsSlider } from "./AuthTestimonialsSilder";

export function AuthLeftPanel() {
  return (
    <div className="hidden h-full w-1/4 flex-col justify-between rounded-xl bg-violetPrimary px-4 py-10 text-white shadow-sm lg:flex">
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
  );
}
