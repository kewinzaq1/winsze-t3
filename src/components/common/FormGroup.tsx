import type { DetailedHTMLProps, HTMLAttributes } from "react";

export const FormGroup = ({
  children,
  className,
}: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => (
  <div className={`mt-6 flex flex-col gap-1 ${className}`}>{children}</div>
);
