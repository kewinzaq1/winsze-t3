import Image from "next/image";
import avatarPlaceholder from "src/images/avatar_placeholder.png";

export function Message({
  avatar,
  name,
  message,
  variant,
}: {
  avatar?: string;
  name: string;
  message: string;
  variant: "incoming" | "outgoing";
}) {
  return (
    <div
      className={`flex w-max flex-col gap-2 rounded-md p-4 shadow-sm ${
        variant === "incoming" ? "bg-slate-100" : "bg-slate-600 text-white"
      }`}
    >
      <div
        className={`flex items-center gap-2 ${
          variant === "outgoing" ? "text-white" : ""
        }`}
      >
        <Image
          src={avatar ?? avatarPlaceholder}
          alt="avatar"
          className="h-12 w-12 rounded-full"
          width="48"
          height="48"
        />
        <p className="font-semibold">{name}</p>
      </div>
      <p className="text-sm">{message}</p>
    </div>
  );
}
