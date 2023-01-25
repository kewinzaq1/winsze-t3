import Link from "next/link";
import type { ReactNode } from "react";
import { trpc } from "src/utils/trpc";
import Image from "next/image";
import avatarPlaceholder from "src/images/avatar_placeholder.png";
import { useRouter } from "next/router";

export const MessagesLayout = ({ children }: { children: ReactNode }) => {
  const { data: users, isLoading } = trpc.follow.getFollowers.useQuery({});

  const { id } = useRouter().query;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <aside className="fixed h-screen w-1/4 rounded-md bg-slate-300 px-4 pt-24 shadow-md">
        <h1 className="mb-4 text-center text-2xl font-bold">Messages</h1>
        <ul className="flex flex-col gap-2">
          {users?.map((user) => (
            <li key={user.user.id}>
              <Link
                href={`/messages/${user.user.id}`}
                className="flex flex-col gap-1"
              >
                <div
                  className={`flex items-center gap-2 rounded-md bg-slate-50 p-4 shadow-sm ${
                    id === user.user.id ? "!bg-slate-200" : ""
                  }`}
                >
                  <Image
                    src={user.user.image ?? avatarPlaceholder}
                    alt="avatar"
                    className="h-12 w-12 rounded-full"
                    width="48"
                    height="48"
                  />
                  <div className="flex flex-col gap-1 truncate">
                    <p className="font-semibold">
                      {user.user.name || user.user.email?.split("@")[0]}
                    </p>
                    <p>{user.user.email}</p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </aside>
      {children}
    </>
  );
};
