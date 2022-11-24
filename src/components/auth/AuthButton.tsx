import type { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

interface AuthButton
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  variant?: "primary" | "secondary";
}

export const AuthButton = ({
  className,
  children,
  variant,
  ...restProps
}: AuthButton) => {
  const basicClasses = () => {
    switch (variant) {
      case "primary":
        return "rounded-md border bg-violetPrimary p-4 text-white outline-none transition hover:border-violetPrimary hover:bg-slate-50 hover:text-violetPrimary focus:border-violetPrimary focus:bg-slate-50 focus:text-violetPrimary active:scale-95";
      case "secondary":
        return "duration-250 col-start-1 flex w-max items-center gap-2 rounded-md border border-violetPrimary bg-slate-50 p-4 outline-none transition hover:bg-violetPrimary hover:text-slate-50 focus:bg-violetPrimary focus:text-slate-50 active:scale-95";
      default:
        return "rounded-md border bg-violetPrimary p-4 text-white outline-none transition hover:border-violetPrimary hover:bg-slate-50 hover:text-violetPrimary focus:border-violetPrimary focus:bg-slate-50 focus:text-violetPrimary active:scale-95";
    }
  };

  return (
    <button className={`${basicClasses()} ${className}`} {...restProps}>
      {children}
    </button>
  );
};
