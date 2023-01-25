import { useRouter } from "next/router";
import { MessagesLayout } from "src/components/messages/layout";
import { trpc } from "src/utils/trpc";
import { useSession } from "next-auth/react";
import { Message } from "../../components/messages/Message";
import { Input } from "src/components/common/Input";
import { Button } from "src/components/common/Button";
import { useRef } from "react";

export default function Messages() {
  const router = useRouter();
  const { id } = router.query;
  const { data: session } = useSession();
  const inputRef = useRef<HTMLInputElement>(null);

  const currentUser = session?.user;

  const { data: user, isLoading } = trpc.users.getUser.useQuery(
    { id: id as string },
    {
      enabled: !!id,
    }
  );

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(inputRef.current?.value);
  };

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
      <main className="ml-auto flex min-h-screen w-3/4 flex-col gap-2 p-4 pt-48 pb-20 shadow-md">
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
      <div className="fixed bottom-0 right-0 w-3/4 bg-white p-4 shadow-md">
        <form className="flex items-center gap-4" onSubmit={onSubmit}>
          <Input placeholder="Type a message..." ref={inputRef} />
          <Button type="submit">Send</Button>
        </form>
      </div>
    </MessagesLayout>
  );
}
