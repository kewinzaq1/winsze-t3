import { useAutoAnimate } from "@formkit/auto-animate/react";
import { atom, useAtom } from "jotai";
import type { LegacyRef } from "react";
import { GrFormCheckmark } from "react-icons/gr";
import { MdOutlineSmsFailed, MdOutlineErrorOutline } from "react-icons/md";

export const atomVisible = atom(false);
export const atomMessage = atom("Fancy error");
export const atomType = atom("info");
export const atomDescription = atom("Some description, maybe a link to a page");
export const atomDuration = atom(3000);
export const atomClosable = atom(false);
export const atomStyle = atom<React.CSSProperties>({});
export const atomClassName = atom("");
export const atomOnClose = atom<() => void>(() => null);
export const atomPlacement = atom<
  "topLeft" | "topRight" | "bottomLeft" | "bottomRight"
>("bottomRight");

const atomDurationWithTimeout = atom(
  (get) => get(atomDuration),
  (get, set, newDuration: number) => {
    set(atomDuration, newDuration);
    const durationTimeout = setTimeout(() => {
      set(atomVisible, false);
    }, newDuration);
    if (get(atomVisible)) {
      clearTimeout(durationTimeout);
    }
  }
);

const atomClose = atom(null, (get, set) => {
  if (get(atomClosable)) {
    get(atomOnClose)?.();
    set(atomVisible, false);
  }
});

export const useNotifier = () => {
  const [, setVisible] = useAtom(atomVisible);
  const [, setMessage] = useAtom(atomMessage);
  const [, setType] = useAtom(atomType);
  const [, setDescription] = useAtom(atomDescription);
  const [, setDuration] = useAtom(atomDurationWithTimeout);
  const [, setClosable] = useAtom(atomClosable);
  const [, setStyle] = useAtom(atomStyle);
  const [, setClassName] = useAtom(atomClassName);
  const [, setOnClose] = useAtom(atomOnClose);
  const [, setPlacement] = useAtom(atomPlacement);

  const show = ({
    message,
    type,
    description,
    duration,
    closable,
    style,
    className,
    onClose,
    placement,
  }: {
    message: string;
    type: "success" | "error" | "warning" | "info";
    description: string;
    duration?: number;
    closable?: boolean;
    style?: React.CSSProperties;
    className?: string;
    onClose?: () => void;
    placement?: "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
  }) => {
    setMessage(message);
    setType(type);
    setDescription(description);
    duration && setDuration(duration);
    closable && setClosable(closable);
    style && setStyle(style);
    className && setClassName(className);
    onClose && setOnClose(onClose);
    placement && setPlacement(placement);
    setVisible(true);
  };

  const hide = () => {
    setVisible(false);
  };

  return {
    show,
    hide,
  };
};

export const Notifier = () => {
  const [visible] = useAtom(atomVisible);
  const [ref] = useAutoAnimate();

  console.log(visible);

  return (
    <div className="" id="notifier" ref={ref as LegacyRef<HTMLDivElement>}>
      {visible && <Toast />}
    </div>
  );
};

const Toast = () => {
  const [message] = useAtom(atomMessage);
  const [type] = useAtom(atomType);
  const [description] = useAtom(atomDescription);
  const [style] = useAtom(atomStyle);
  const [className] = useAtom(atomClassName);
  const [placement] = useAtom(atomPlacement);

  const getIcon = () => {
    switch (type) {
      case "success":
        return <GrFormCheckmark className="h-8 w-8 text-green-500" />;
      case "error":
        return <MdOutlineErrorOutline className="h-8 w-8 text-red-500" />;
      case "warning":
        return <MdOutlineSmsFailed className="h-8 w-8 text-yellow-500" />;
      case "info":
        return <MdOutlineSmsFailed className="h-8 w-8 text-blue-500" />;
      default:
        return <MdOutlineSmsFailed className="h-8 w-8 text-blue-500" />;
    }
  };

  const getPosition = () => {
    switch (placement) {
      case "topLeft":
        return "top-24 left-24";
      case "topRight":
        return "top-24 right-24";
      case "bottomLeft":
        return "bottom-12 left-12";
      case "bottomRight":
        return "bottom-12 right-12";
      default:
        return "bottom-12 right-12";
    }
  };

  const getBaseStyle = () => {
    switch (type) {
      case "success":
        return "bg-green-100 border-green-500";
      case "error":
        return "bg-red-100 border-red-500";
      case "warning":
        return "bg-yellow-100 border-yellow-500";
      case "info":
        return "bg-blue-100 border-blue-500";
      default:
        return "bg-blue-100 border-blue-500";
    }
  };

  const Icon = () => getIcon();

  const [, close] = useAtom(atomClose);

  return (
    <div
      role="status"
      className={`${getPosition()} ${getBaseStyle()} ${className} fixed z-[9999] flex h-max w-max min-w-fit items-center gap-2 rounded-md bg-white p-2 shadow-md`}
      style={style}
      onClick={close}
    >
      <div className="flex items-center justify-center whitespace-nowrap rounded-full bg-white p-2">
        <Icon />
      </div>
      <div className="flex flex-col whitespace-nowrap px-4 py-2">
        <p>{message}</p>
        <p>{description}</p>
      </div>
    </div>
  );
};
