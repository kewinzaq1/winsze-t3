import type { DetailedHTMLProps, HTMLAttributes } from "react";

export const ErrorMessage = ({
  className,
  ...rest
}: DetailedHTMLProps<
  HTMLAttributes<HTMLParagraphElement>,
  HTMLParagraphElement
>) => (
  <p
    className={`${className} absolute top-8 m-0 p-0 text-sm text-red-500`}
    {...rest}
  ></p>
);
