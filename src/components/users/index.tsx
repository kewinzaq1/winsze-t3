import { Submenu } from "src/components/layout/Submenu";
import { trpc } from "src/utils/trpc";
import { UserCard } from "./UserCard";
import { UserSkeletons } from "./UserSkeltons";
import { Input } from "src/components/common/Input";
import { FormGroup } from "../common/FormGroup";
import { Button } from "../common/Button";
import { Label } from "../common/Label";
import { useMemo, useState } from "react";

export const Users = () => {
  const { data: users, isLoading } = trpc.users.getUsers.useQuery();

  const [value, setValue] = useState("");

  const filteredUsers = useMemo(() => {
    if (!value) return users;
    return users?.filter(
      (user) =>
        user.name?.toLowerCase().includes(value.toLowerCase()) ||
        user.email?.toLowerCase().includes(value.toLowerCase())
    );
  }, [users, value]);

  return (
    <div className="pt-24">
      <h1 className="mx-auto w-max text-6xl font-semibold">Users</h1>
      <div className="mx-auto flex w-full max-w-xl flex-col">
        <FormGroup className="mb-8">
          <Label>Find user</Label>
          <Input value={value} onChange={(e) => setValue(e.target.value)} />
        </FormGroup>
        {filteredUsers?.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
        {isLoading && <UserSkeletons length={12} />}
        {!isLoading && !filteredUsers?.length && (
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-4xl font-semibold">No users found</h1>
            {value.length > 0 && (
              <Button className="mt-4" onClick={() => setValue("")}>
                Clear search
              </Button>
            )}
          </div>
        )}
      </div>
      <Submenu currentPage="users" />
    </div>
  );
};
