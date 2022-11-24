import type { DetailedHTMLProps, InputHTMLAttributes } from "react";
import { forwardRef } from "react";

export const AuthInput = forwardRef<
  HTMLInputElement,
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
>(({ className, ...restProps }, ref) => (
  <input
    type="text"
    className={`rounded-md border border-slate-400 bg-white p-2 outline-none focus:border-violetPrimary ${className}`}
    {...restProps}
    ref={ref}
  />
));

AuthInput.displayName = "AuthInput";
