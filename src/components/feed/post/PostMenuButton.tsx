import type { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

export const PostMenuButton = ({
  className,
  ...props
}: DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>) => (
  <button
    {...props}
    className={`${className} w-full rounded-t-md p-2 text-left transition hover:bg-slate-100`}
  />
);
