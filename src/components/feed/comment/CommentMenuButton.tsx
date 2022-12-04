import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

export const CommentMenuButton = ({
  className,
  ...props
}: DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>) => {
  return (
    <button {...props} className={`${className} w-full p-2 text-left`}>
      Edit
    </button>
  );
};
