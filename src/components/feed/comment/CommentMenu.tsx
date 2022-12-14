import { ReactNode } from "react";
import { createRef } from "react";
import { useClickAway } from "src/hooks/useClickAway";

interface CommentMenuProps {
  setOpenMenu: (open: boolean) => void;
  children: ReactNode;
}
export const CommentMenu = ({ children, setOpenMenu }: CommentMenuProps) => {
  const menuRef = createRef<HTMLDivElement>();
  useClickAway(menuRef, () => setOpenMenu(false));

  return (
    <div
      className="absolute right-0 top-0 z-10 ml-auto h-max bg-white"
      ref={menuRef}
    >
      <div className="flex flex-col rounded-md shadow-md">{children}</div>
    </div>
  );
};
