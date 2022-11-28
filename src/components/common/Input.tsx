import type { DetailedHTMLProps, InputHTMLAttributes } from "react";
import { forwardRef } from "react";

interface AuthInputProps
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  error?: boolean;
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ className, error, ...restProps }, ref) => (
    <input
      type="text"
      className={`rounded-md border border-slate-400 bg-white p-2 outline-none focus:border-violetPrimary ${className} ${
        error ? "!border-red-500 focus:!border-red-500" : ""
      }`}
      {...restProps}
      ref={ref}
    />
  )
);

AuthInput.displayName = "AuthInput";
