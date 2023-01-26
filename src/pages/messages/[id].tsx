import { useRouter } from "next/router";
import { MessagesLayout } from "src/components/messages/layout";
import type { RouterOutputs } from "src/utils/trpc";
import { trpc } from "src/utils/trpc";
import { useSession } from "next-auth/react";
import { Message } from "../../components/messages/Message";
import { Input } from "src/components/common/Input";
import { Button } from "src/components/common/Button";
import { useMemo, useRef } from "react";
import { useNotifier } from "src/components/notifier";
import { data } from "cypress/types/jquery";

export default function Messages() {
  const router = useRouter();
  const { id } = router.query;
  const { data: session } = useSession();
  const inputRef = useRef<HTMLInputElement>(null);
  const { show } = useNotifier();

  const { data: room, isLoading } = trpc.chat.getRoom.useQuery(
    { id: id as string },
    {
      enabled: !!id,
      onError(err) {
        show({
          message: "Error",
          description: err.message,
          type: "error",
          closable: true,
        });
      },
      refetchInterval(data) {
        if (data?.Message.length) {
          return 1000;
        }
        return false;
      },
    }
  );

  const isIncoming = (
    message: RouterOutputs["chat"]["getMessages"][number]
  ) => {
    return message.userId !== session?.user?.id;
  };

  const isOutgoing = (
    message: RouterOutputs["chat"]["getMessages"][number]
  ) => {
    return message.userId === session?.user?.id;
  };

  const { mutateAsync: sendMessage } = trpc.chat.sendMessage.useMutation({
    onError(err) {
      show({
        message: "Error",
        description: err.message,
        type: "error",
        closable: true,
      });
    },
  });

  const currentUser = session?.user;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(inputRef.current?.value);
    await sendMessage({
      chatRoomId: id as string,
      content: inputRef.current?.value as string,
    });
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  if (isLoading) {
    return <div className="mt-24">is loading...</div>;
  }

  return (
    <MessagesLayout>
      <header className="align-center fixed right-0 flex w-3/4 items-center justify-center bg-white p-4 pt-24 shadow-md">
        <p className="mr-4 text-lg">
          Messages with
          <span className="font-bold"> {room?.owner.name}</span>
        </p>
      </header>
      <main className="ml-auto flex min-h-screen w-3/4 flex-col gap-2 p-4 pt-48 pb-20 shadow-md">
        <div className="flex flex-col gap-4">
          <div className="align-end flex flex-col items-end justify-end gap-2">
            {room?.Message.map((message) => {
              if (isIncoming(message)) {
                return (
                  <Message
                    key={message.id}
                    avatar={room.owner?.image as string}
                    name={room.owner?.name as string}
                    message={message.content}
                    variant="incoming"
                  />
                );
              }
              if (isOutgoing(message)) {
                return (
                  <Message
                    key={message.id}
                    avatar={currentUser?.image as string}
                    name={
                      (currentUser?.name as string) ||
                      currentUser?.email?.split("@")[0] ||
                      ""
                    }
                    message={message.content}
                    variant="outgoing"
                  />
                );
              }
            })}
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
