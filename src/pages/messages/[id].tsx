import { useRouter } from "next/router";
import { MessagesLayout } from "src/components/messages/layout";
import { trpc } from "src/utils/trpc";
import Image from "next/image";
import avatarPlaceholder from "src/images/avatar_placeholder.png";
import { useSession } from "next-auth/react";

export default function Messages() {
  const router = useRouter();
  const { id } = router.query;
  const { data: session } = useSession();

  const currentUser = session?.user;

  const { data: user, isLoading } = trpc.users.getUser.useQuery(
    { id: id as string },
    {
      enabled: !!id,
    }
  );

  if (isLoading || !user || !currentUser) {
    return <div>is loading...</div>;
  }

  return (
    <MessagesLayout>
      <header className="align-center fixed right-0 flex w-3/4 items-center justify-center bg-white p-4 pt-24 shadow-md">
        <p className="mr-4 text-lg">
          Messages with
          <span className="font-bold"> {user?.name}</span>
        </p>
      </header>
      <main className="ml-auto flex min-h-screen w-3/4 flex-col gap-2 p-4 py-48 shadow-md">
        <div className="flex flex-col gap-4">
          <div className="align-end flex flex-col items-end justify-end gap-2">
            <Message
              avatar={currentUser?.image as string}
              name={
                (currentUser?.name as string) ||
                currentUser?.email?.split("@")[0]
              }
              message="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod."
              variant="outgoing"
            />
            <Message
              avatar={user?.image as string}
              name={user?.name as string}
              message="Lorem ipsum dolor sit amet."
              variant="incoming"
            />
            <Message
              avatar={currentUser?.image as string}
              name={
                (currentUser?.name as string) ||
                currentUser?.email?.split("@")[0]
              }
              message="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod."
              variant="outgoing"
            />
            <Message
              avatar={user?.image as string}
              name={user?.name as string}
              message="Lorem ipsum dolor sit amet."
              variant="incoming"
            />
            <Message
              avatar={currentUser?.image as string}
              name={
                (currentUser?.name as string) ||
                currentUser?.email?.split("@")[0]
              }
              message="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod."
              variant="outgoing"
            />
            <Message
              avatar={user?.image as string}
              name={user?.name as string}
              message="Lorem ipsum dolor sit amet."
              variant="incoming"
            />
            <Message
              avatar={currentUser?.image as string}
              name={
                (currentUser?.name as string) ||
                currentUser?.email?.split("@")[0]
              }
              message="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod."
              variant="outgoing"
            />
            <Message
              avatar={user?.image as string}
              name={user?.name as string}
              message="Lorem ipsum dolor sit amet."
              variant="incoming"
            />
            <Message
              avatar={currentUser?.image as string}
              name={
                (currentUser?.name as string) ||
                currentUser?.email?.split("@")[0]
              }
              message="Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod."
              variant="outgoing"
            />
            <Message
              avatar={user?.image as string}
              name={user?.name as string}
              message="Lorem ipsum dolor sit amet."
              variant="incoming"
            />
          </div>
        </div>
      </main>
    </MessagesLayout>
  );
}

function Message({
  avatar,
  name,
  message,
  variant,
}: {
  avatar?: string;
  name: string;
  message: string;
  variant: "incoming" | "outgoing";
}) {
  return (
    <div
      className={`flex w-max flex-col gap-2 rounded-md p-4 shadow-sm ${
        variant === "incoming" ? "bg-slate-100" : "bg-slate-600 text-white"
      }`}
    >
      <div
        className={`flex items-center gap-2 ${
          variant === "outgoing" ? "text-white" : ""
        }`}
      >
        <Image
          src={avatar ?? avatarPlaceholder}
          alt="avatar"
          className="h-12 w-12 rounded-full"
          width="48"
          height="48"
        />
        <p className="font-semibold">{name}</p>
      </div>
      <p className="text-sm">{message}</p>
    </div>
  );
}
