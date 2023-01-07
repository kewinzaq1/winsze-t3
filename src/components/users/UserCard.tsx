import type { Follow } from "@prisma/client";
import Image from "next/image";
import imagePlaceholder from "src/images/avatar_placeholder.png";
import Link from "next/link";
import type { RouterOutputs } from "src/utils/trpc";
import { trpc } from "src/utils/trpc";
import { Button } from "../common/Button";
import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";

export const UserCard = ({
  user,
}: {
  user: RouterOutputs["users"]["getUsers"][number];
}) => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const { mutate: follow, isLoading: isFollowing } =
    trpc.follow.follow.useMutation({
      onMutate: (newFollower) => {
        const QUERY = [["users", "getUsers"], { type: "query" }];
        queryClient.cancelQueries(QUERY);

        const previousValue = queryClient.getQueryData(QUERY);

        queryClient.setQueryData(QUERY, (old: unknown) => {
          const updatedData = old as RouterOutputs["users"]["getUsers"];

          updatedData.forEach((u) => {
            if (u.id === newFollower.userId) {
              u.Follow.push({
                ...newFollower,
                followerId: session?.user?.id as string,
              } as Follow);
            }
          });

          return updatedData;
        });

        return previousValue;
      },
      onError: (error, variables, previousValue) => {
        queryClient.setQueryData(
          [["users", "getUsers"], { type: "query" }],
          previousValue
        );
      },
    });
  const { mutate: unfollow, isLoading: isUnfollowing } =
    trpc.follow.unFollow.useMutation({
      onMutate: (unFollowed) => {
        const QUERY = [["users", "getUsers"], { type: "query" }];
        queryClient.cancelQueries(QUERY);

        const previousValue = queryClient.getQueryData(QUERY);

        queryClient.setQueryData(QUERY, (old: unknown) => {
          const updatedData = old as RouterOutputs["users"]["getUsers"];
          console.log(updatedData);

          updatedData.forEach((u) => {
            u.Follow.forEach((f) => {
              if (f.userId === unFollowed.userId) {
                u.Follow = u.Follow.filter(
                  (f) => f.followerId !== session?.user?.id
                );
              }
            });
          });

          return updatedData;
        });

        return previousValue;
      },
      onError: (error, variables, previousValue) => {
        queryClient.setQueryData(["users", "getUsers"], previousValue);
      },
    });

  const isFollowed = user.Follow.some(
    (f) => f.followerId === session?.user?.id
  );

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
      </div>
      <Button
        className="rounded-full"
        variant={isFollowed ? "secondary" : "primary"}
        onClick={() => {
          if (isFollowing || isUnfollowing) return;
          if (isFollowed) {
            unfollow({ userId: user.id });
          } else {
            follow({ userId: user.id });
          }
        }}
      >
        {isFollowed ? "Unfollow" : "Follow"}
      </Button>
    </div>
  );
};
