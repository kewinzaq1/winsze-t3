import type { RouterOutputs } from "src/utils/trpc";
import Image from "next/image";
import avatarPlaceholder from "src/images/avatar_placeholder.png";
import { useRouter } from "next/router";
import Link from "next/link";

export const ConversationCard = ({
  user,
  conversationId,
}: {
  user: RouterOutputs["chat"]["getAllConversations"][number]["participants"][number];
  conversationId: string;
}) => {
  const router = useRouter();

  const { id } = router.query;

  return (
    <li className="transition-all hover:shadow-md hover:outline-1 hover:outline-slate-50">
      <Link
        href={`/messages/${conversationId}`}
        className="flex flex-col gap-1"
      >
        <div
          className={`flex items-center gap-2 rounded-md bg-slate-200 p-4 shadow-sm ${
            id === conversationId ? "!bg-slate-50" : ""
          }`}
        >
          <Image
            src={user.image ?? avatarPlaceholder}
            alt="avatar"
            className="h-12 w-12 rounded-full"
            width="48"
            height="48"
          />
          <div className="flex flex-col gap-1 truncate">
            <p className="font-semibold">
              {user.name || user.email?.split("@")[0]}
            </p>
            <p>{user.email}</p>
          </div>
        </div>
      </Link>
    </li>
  );
};
