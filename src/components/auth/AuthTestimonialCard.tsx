import Image from "next/image";

export const TestimonialCard = () => {
  return (
    <div className="flex w-full flex-col gap-4 rounded-md glass">
      <header>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Veniam
        excepturi repellat,
      </header>
      <div className="flex items-center justify-start">
        <Image
          src="https://i.pravatar.cc/300"
          alt="random avatar"
          width={50}
          height={50}
          className="mr-2 rounded-md"
        />
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold">John Doe</h3>
          <p className="text-xs text-slate-200">CEO, Google</p>
        </div>
      </div>
    </div>
  );
};
