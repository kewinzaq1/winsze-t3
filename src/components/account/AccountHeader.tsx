import { useSession } from "next-auth/react";

export const AccountHeader = () => {
  const session = useSession();

  return (
    <header className="col-span-4 pt-4">
      <h1 className="text-4xl font-bold">Account</h1>
      <p className="text-2xl text-gray-500">
        Welcome, {session.data?.user?.email}
      </p>
    </header>
  );
};
