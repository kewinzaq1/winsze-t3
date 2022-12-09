import { errors } from "formidable";
import type { DetailedHTMLProps, HTMLAttributes } from "react";

export const InputError = ({
  className,
  ...rest
}: DetailedHTMLProps<
  HTMLAttributes<HTMLParagraphElement>,
  HTMLParagraphElement
>) => {
  return (
    <p className={`${className} m-0 p-0 text-xs text-red-500`} {...rest} />
  );
};
