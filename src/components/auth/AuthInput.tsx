import type { DetailedHTMLProps, InputHTMLAttributes } from "react";

export const AuthInput = ({
  className,
  ...restProps
}: DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>) => (
  <input
    type="text"
    className={`rounded-md border border-slate-400 bg-white p-2 outline-none focus:border-violetPrimary ${className}`}
    {...restProps}
  />
);
