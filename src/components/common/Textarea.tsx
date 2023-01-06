import type {
  DetailedHTMLProps,
  LegacyRef,
  TextareaHTMLAttributes,
} from "react";
import { forwardRef } from "react";

export const Textarea = forwardRef(
  (
    {
      className,
      ...restProps
    }: DetailedHTMLProps<
      TextareaHTMLAttributes<HTMLTextAreaElement>,
      HTMLTextAreaElement
    >,
    ref
  ) => {
    return (
      <textarea
        ref={ref as LegacyRef<HTMLTextAreaElement>}
        {...restProps}
        className={`${className} min-h-3/4 scrollbar-rounded-md h-max w-full resize-none overflow-y-auto rounded-md p-4 outline-none focus:border-transparent focus:outline-none focus:ring-2 focus:ring-gray-300`}
      />
    );
  }
);

Textarea.displayName = "Textarea";
