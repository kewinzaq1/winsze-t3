import dayjs from "dayjs";
import { useRouter } from "next/router";
import { Post } from "src/components/feed/post/Post";
import type { RouterOutputs } from "src/utils/trpc";
import { trpc } from "src/utils/trpc";
import Image from "next/image";
import avatarPlaceholder from "src/images/avatar_placeholder.png";
import notFoundUser from "src/assets/not_found_user.png";
import { SingleUserSkeleton } from "src/components/users/SingleUser/SingleUserSkeleton";
import { Button } from "src/components/common/Button";
import { useNotifier } from "src/components/notifier";
import { useQueryClient } from "@tanstack/react-query";

export default function SingleUserPage() {
  const router = useRouter();
  const { show } = useNotifier();
  const queryClient = useQueryClient();

  const id = router.query.id as string;
  const { data: user, isLoading } = trpc.users.getUser.useQuery(
    {
      id: id as string,
    },
    { enabled: Boolean(id) }
  );

  const { mutate: addFriend, isLoading: isAddingFriend } =
    trpc.friends.addUserToFriends.useMutation({
      onSuccess: () => {
        show({
          type: "success",
          message: "User added to friends",
          description: "You can now see his posts in your feed",
        });
      },
      onError: (error) => {
        show({
          type: "error",
          message: "Error",
          description: error.message,
        });
      },
      onMutate: (newFriend) => {
        const QUERY = [["users", "getUser"], { input: { id }, type: "query" }];
        queryClient.cancelQueries(QUERY);

        const previousValue = queryClient.getQueryData(QUERY);

        queryClient.setQueryData(QUERY, (old: unknown) => {
          const oldData = old as RouterOutputs["users"]["getUser"];
          return {
            ...oldData,
            Friend: [...(oldData?.Friend || []), newFriend],
          };
        });

        return previousValue;
      },
    });

  const { mutate: removeFriend, isLoading: isRemovingFriend } =
    trpc.friends.removeUserFromFriends.useMutation({
      onSuccess: () => {
        show({
          type: "success",
          message: "User removed from friends",
          description: "You can no longer see his posts in your feed",
        });
      },
      onError: (error) => {
        show({
          type: "error",
          message: "Error",
          description: error.message,
        });
      },
      onMutate: () => {
        const QUERY = [["users", "getUser"], { input: { id }, type: "query" }];
        queryClient.cancelQueries(QUERY);

        const previousValue = queryClient.getQueryData(QUERY);

        queryClient.setQueryData(QUERY, (old: unknown) => {
          const oldData = old as RouterOutputs["users"]["getUser"];
          return {
            ...oldData,
            Friend: oldData?.Friend?.filter((friend) => friend.userId !== id),
          };
        });

        return previousValue;
      },
    });

  const isYourFriend = user?.Friend?.some((friend) => friend.userId === id);

  if (!user && !isLoading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center pt-24">
        <h1 className="mx-auto text-4xl font-semibold">User not found</h1>
        <Image src={notFoundUser} width={500} height={500} alt="not-found" />
      </div>
    );
  }

  if (isLoading) {
    return <SingleUserSkeleton />;
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center justify-center pt-24">
      <header className="flex w-full flex-col justify-between gap-2">
        <div className="flex justify-between gap-2">
          {user?.image ? (
            <Image
              src={user?.image}
              width={50}
              height={50}
              alt={`${user?.name} avatar`}
              title={`${user?.name} avatar`}
              className="h-16 w-16 rounded-full object-cover"
            />
          ) : (
            <Image
              src={avatarPlaceholder}
              width={50}
              height={50}
              alt={`${user?.name} avatar`}
              title={`${user?.name} avatar`}
              className="h-16 w-16 rounded-full object-cover"
            />
          )}
          <div className="flex flex-col justify-start">
            <h1 className="text-4xl">{user?.name || user?.email}</h1>
            <div className="flex items-center justify-end gap-1">
              <p className="w-max rounded-full bg-blue-100 px-2 py-1">
                In winsze {dayjs(user?.createdAt).toNow()}
              </p>
              <p className="w-max rounded-full bg-red-100 px-2 py-1">
                {user?.role || "user"}
              </p>
            </div>
            <Button
              className="ml-auto mt-4 w-max justify-self-end"
              disabled={isYourFriend ? isRemovingFriend : isAddingFriend}
              isLoading={isYourFriend ? isRemovingFriend : isAddingFriend}
              onClick={() => {
                if (!id) return;

                if (isYourFriend) {
                  removeFriend({ userId: id as string });
                  return;
                }
                addFriend({ userId: id as string });
              }}
            >
              {isYourFriend ? "Remove from friends" : "Add to friends"}
            </Button>
          </div>
        </div>
      </header>
      {user?.Post.map((post) => (
        <Post key={post.id} post={post} userId={id.toString()} />
      ))}
      {user?.Post.length === 0 && (
        <p className="mt-24 text-center text-gray-500">
          {user.name} has no posts yet.
        </p>
      )}
    </div>
  );
}
