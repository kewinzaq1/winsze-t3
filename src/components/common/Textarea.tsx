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
        className={`${className} min-h-3/4 h-max w-full resize-none rounded-md p-4 text-xl outline-none focus:border-transparent focus:outline-none focus:ring-2 focus:ring-violetPrimary`}
      />
    );
  }
);

Textarea.displayName = "Textarea";
