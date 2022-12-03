import type { DetailedHTMLProps, TextareaHTMLAttributes } from "react";

export const Textarea = ({
  className,
  ...restProps
}: DetailedHTMLProps<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
>) => {
  return (
    <textarea
      {...restProps}
      className={`${className} min-h-3/4 h-max w-full resize-none rounded-md p-4 text-xl outline-none focus:border-transparent focus:outline-none focus:ring-2 focus:ring-violetPrimary`}
    />
  );
};
