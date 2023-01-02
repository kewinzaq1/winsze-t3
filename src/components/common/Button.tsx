import type { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import Image from "next/image";

interface ButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  variant?: "primary" | "secondary" | "error" | "warning" | "success" | "info";
  isLoading?: boolean;
}

export const Button = ({
  className,
  children,
  variant,
  isLoading,
  ...restProps
}: ButtonProps) => {
  const basicClasses = () => {
    switch (variant) {
      case "primary":
        return "flex items-center rounded-md border bg-slate-700 p-3 text-white outline-none transition hover:bg-slate-800 font-semibold focus:border-slate-700 focus:text-bg-slate-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100";
      case "secondary":
        return "flex items-center rounded-md border bg-slate-300 p-3 outline-none transition hover:bg-slate-200 font-semibold focus:border-slate-200 focus:text-bg-slate-200 active:scale-95 active:text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100";
      case "error":
        return "flex items-center duration-250 col-start-1 flex items-center rounded-md border border-red-500 bg-red-50 p-3 outline-none transition hover:bg-red-500 hover:text-slate-50 focus:bg-red-500 focus:text-slate-50 active:scale-95 text-red-500 disabled:bg-opacity-50 disabled:cursor-not-allowed disabled:active:scale-100";
      case "warning":
        return "flex items-center duration-250 col-start-1 flex items-center rounded-md border border-yellow-500 bg-yellow-50 p-3 outline-none transition hover:bg-yellow-500 hover:text-slate-50 focus:bg-yellow-500 focus:text-slate-50 active:scale-95 text-yellow-500 disabled:bg-opacity-50 disabled:cursor-not-allowed disabled:active:scale-100";
      case "success":
        return "flex items-center duration-250 col-start-1 flex items-center rounded-md border border-green-500 bg-green-50 p-3 outline-none transition hover:bg-green-500 hover:text-slate-50 focus:bg-green-500 focus:text-slate-50 active:scale-95 text-green-500 disabled:bg-opacity-50 disabled:cursor-not-allowed disabled:active:scale-100";
      default:
        return "flex items-center rounded-md border bg-slate-700 p-3 text-white outline-none transition hover:bg-slate-800 font-semibold focus:border-slate-700 focus:text-bg-slate-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100";
    }
  };

  return (
    <button className={`${basicClasses()} ${className}`} {...restProps}>
      {isLoading ? (
        <>
          <Image
            src="/svg/oval.svg"
            alt="loading oval"
            role="progressbar"
            width={20}
            height={20}
            className="h-full w-6"
          />
          <p className="text-[currentColor]"></p>
        </>
      ) : (
        children
      )}
    </button>
  );
};
