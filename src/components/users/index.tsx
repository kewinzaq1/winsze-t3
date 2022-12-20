import { Submenu } from "src/components/layout/Submenu";
import { trpc } from "src/utils/trpc";
import { UserCard } from "./UserCard";

export const Users = () => {
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
};
