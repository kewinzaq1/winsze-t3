import { useEffect, useRef } from "react";

export const useClickAway = (
  ref: React.RefObject<HTMLElement>,
  onClickAway: () => void
) => {
  const onClickAwayRef = useRef(onClickAway);

  onClickAwayRef.current = onClickAway;

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClickAwayRef.current();
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [ref]);
};
