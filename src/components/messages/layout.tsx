import type { ReactNode } from "react";
import { trpc } from "src/utils/trpc";
import { useInitWebsocket } from "src/utils/useInitWebSocket";
import { Follower } from "./Follower";
import { FollowerSkeleton } from "./FollowerSkeleton";

export const MessagesLayout = ({ children }: { children: ReactNode }) => {
  useInitWebsocket();
  const { data: users, isLoading } = trpc.follow.getFollowers.useQuery({});

  const SKELETONS_ARR = new Array(8).fill(0);

  return (
    <>
      <aside className="fixed h-screen w-1/4 rounded-md bg-slate-300 pt-24 shadow-md">
        <h1 className="text-center text-2xl font-bold">Messages</h1>
        <hr className="my-4" />
        <ul className="flex h-full flex-col gap-2 overflow-y-auto px-4 pb-20">
          {users?.map((user) => (
            <Follower key={user.user.id} user={user} />
          ))}
          {isLoading &&
            SKELETONS_ARR.map((_, i) => <FollowerSkeleton key={i} />)}
        </ul>
      </aside>
      {children}
    </>
  );
};
