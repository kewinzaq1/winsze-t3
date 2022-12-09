import { TestimonialsSlider } from "./AuthTestimonialsSilder";
import background from "src/assets/background/auth.jpg";
import Image from "next/image";

export function AuthLeftPanel() {
  return (
    <div className="relative hidden h-full w-1/4 flex-col justify-between rounded-xl px-4 py-10 text-white shadow-sm lg:flex">
      <Image
        src={background}
        alt="background"
        layout="fill"
        objectFit="cover"
        className="z-1 rounded-md"
        placeholder="blur"
      />
      <div className="glass relative z-50 flex flex-col">
        <p className="text-xl font-normal">Winsze - T3</p>
        <div className="flex flex-col">
          <h1 className="text-4xl">Start your journey with us.</h1>
          <p className="lg:font-2xl mt-4 font-extralight">
            Discover the world&apos;s best community of freelancers and business
            owners
          </p>
        </div>
      </div>
      <TestimonialsSlider />
    </div>
  );
}
