import type { DetailedHTMLProps, LegacyRef, HTMLAttributes } from "react";
import { forwardRef } from "react";

export const PostMenu = forwardRef(
  (
    {
      className,
      ...props
    }: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    ref: LegacyRef<HTMLDivElement>
  ) => (
    <div
      ref={ref}
      {...props}
      className={`${className} absolute top-12 right-4 z-50 h-max w-24 rounded-md bg-white shadow-md`}
    />
  )
);
PostMenu.displayName = "PostMenu";
