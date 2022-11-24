import type { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import Image from "next/image";

interface AuthButton
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  variant?: "primary" | "secondary";
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
        return "flex items-center rounded-md border bg-violetPrimary p-4 text-white outline-none transition hover:border-violetPrimary hover:bg-slate-50 hover:text-violetPrimary focus:border-violetPrimary focus:bg-slate-50 focus:text-violetPrimary active:scale-95";
      case "secondary":
        return "flex items-center duration-250 col-start-1 flex items-center rounded-md border border-violetPrimary bg-slate-50 p-4 outline-none transition hover:bg-violetPrimary hover:text-slate-50 focus:bg-violetPrimary focus:text-slate-50 active:scale-95 text-violetSecondary";
      default:
        return "flex items-center rounded-md border bg-violetPrimary p-4 text-white outline-none transition hover:border-violetPrimary hover:bg-slate-50 hover:text-violetPrimary focus:border-violetPrimary focus:bg-slate-50 focus:text-violetPrimary active:scale-95";
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
          <p className="text-violetSecondary">Loading</p>
        </>
      ) : (
        children
      )}
    </button>
  );
};
