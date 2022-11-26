import type { DetailedHTMLProps, LabelHTMLAttributes } from "react";

export const AuthLabel = ({
  className,
  children,
  ...restProps
}: DetailedHTMLProps<
  LabelHTMLAttributes<HTMLLabelElement>,
  HTMLLabelElement
>) => (
  <label
    className={`flex items-center gap-2 whitespace-nowrap text-slate-600 ${className}`}
    {...restProps}
  >
    {children}
  </label>
);
