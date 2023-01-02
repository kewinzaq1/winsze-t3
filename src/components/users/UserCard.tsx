import type { User } from "@prisma/client";
import Image from "next/image";
import imagePlaceholder from "src/images/avatar_placeholder.png";
import Link from "next/link";

export const UserCard = ({ user }: { user: User }) => {
  return (
    <div
      className="flex gap-4 rounded-md border-2 border-transparent border-b-slate-400 border-opacity-10 bg-white p-4
        shadow-md transition-all hover:border-opacity-100
    "
    >
      <Image
        src={user.image ?? imagePlaceholder}
        alt="avatar"
        className="h-12 w-12 rounded-full"
        width="48"
        height="48"
      />
      <div className="flex w-full items-center justify-between">
        <div className="col flex flex-col gap-1">
          <Link href={`/users/${user.id}`}>
            <p className="font-semibold">
              {user.name || user.email?.split("@")[0]}
            </p>
          </Link>
          <p>{user.email}</p>
        </div>
        <p className="w-max rounded-full bg-slate-300 p-2 px-2 py-1 text-sm lowercase">
          {user.role || "user"}
        </p>
      </div>
    </div>
  );
};
