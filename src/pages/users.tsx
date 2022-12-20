import type { User } from "@prisma/client";
import Image from "next/image";
import { Submenu } from "src/components/layout/Submenu";
import { trpc } from "src/utils/trpc";
import imagePlaceholder from "src/images/avatar_placeholder.png";

export default function UsersPage() {
  const { data: users } = trpc.users.getUsers.useQuery();

  return (
    <div className="pt-24">
      <h1 className="mx-auto w-max text-6xl font-semibold">Users</h1>
      <div className="mx-auto flex w-full max-w-xl flex-col">
        {users?.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>
      <Submenu currentPage="users" />
    </div>
  );
}

const UserCard = ({ user }: { user: User }) => {
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
          <p className="">{user.name}</p>
          <p>{user.email}</p>
        </div>
        <p className="w-max rounded-full bg-slate-300 p-2 px-2 py-1 text-sm lowercase">
          {user.role}
        </p>
      </div>
    </div>
  );
};
