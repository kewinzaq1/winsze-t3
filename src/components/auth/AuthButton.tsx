import type { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import Image from "next/image";

interface AuthButton
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  variant?: "primary" | "secondary" | "error" | "warning" | "success" | "info";
  isLoading?: boolean;
}

export const AuthButton = ({
  className,
  children,
  variant,
  isLoading,
  ...restProps
}: AuthButton) => {
  const basicClasses = () => {
    switch (variant) {
      case "primary":
        return "flex items-center rounded-md border bg-violetPrimary p-4 text-white outline-none transition hover:border-violetPrimary hover:bg-slate-50 hover:text-violetPrimary focus:border-violetPrimary focus:bg-slate-50 focus:text-violetPrimary active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
      case "secondary":
        return "flex items-center duration-250 col-start-1 flex items-center rounded-md border border-violetPrimary bg-slate-50 p-4 outline-none transition hover:bg-violetPrimary hover:text-slate-50 focus:bg-violetPrimary focus:text-slate-50 active:scale-95 text-violetSecondary disabled:bg-opacity-50 disabled:cursor-not-allowed";
      case "error":
        return "flex items-center duration-250 col-start-1 flex items-center rounded-md border border-red-500 bg-red-50 p-4 outline-none transition hover:bg-red-500 hover:text-slate-50 focus:bg-red-500 focus:text-slate-50 active:scale-95 text-red-500 disabled:bg-opacity-50 disabled:cursor-not-allowed";
      case "warning":
        return "flex items-center duration-250 col-start-1 flex items-center rounded-md border border-yellow-500 bg-yellow-50 p-4 outline-none transition hover:bg-yellow-500 hover:text-slate-50 focus:bg-yellow-500 focus:text-slate-50 active:scale-95 text-yellow-500 disabled:bg-opacity-50 disabled:cursor-not-allowed";
      case "success":
        return "flex items-center duration-250 col-start-1 flex items-center rounded-md border border-green-500 bg-green-50 p-4 outline-none transition hover:bg-green-500 hover:text-slate-50 focus:bg-green-500 focus:text-slate-50 active:scale-95 text-green-500 disabled:bg-opacity-50 disabled:cursor-not-allowed";
      default:
        return "flex items-center rounded-md border bg-violetPrimary p-4 text-white outline-none transition hover:border-violetPrimary hover:bg-slate-50 hover:text-violetPrimary focus:border-violetPrimary focus:bg-slate-50 focus:text-violetPrimary active:scale-95 disabled:bg-opacity-50 disabled:cursor-not-allowed";
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
            height={10}
            color="red"
            className="mr-2"
          />
          <p className="text-[currentColor]">Loading</p>
        </>
      ) : (
        children
      )}
    </button>
  );
};
