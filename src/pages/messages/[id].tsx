import { useRouter } from "next/router";
import { MessagesLayout } from "src/components/messages/layout";
import type { RouterOutputs } from "src/utils/trpc";
import { trpc } from "src/utils/trpc";
import { useSession } from "next-auth/react";
import { Message } from "../../components/messages/Message";
import { Input } from "src/components/common/Input";
import { Button } from "src/components/common/Button";
import { useRef } from "react";
import { useNotifier } from "src/components/notifier";
import type { Message as MessageType } from "@prisma/client";
import { useAtom } from "jotai";
import { atomSocket } from "src/utils/useInitWebSocket";

export default function Messages() {
  const router = useRouter();
  const { id } = router.query;
  const { data: session } = useSession();
  const inputRef = useRef<HTMLInputElement>(null);
  const { show } = useNotifier();
  const utils = trpc.useContext();

  const [socket] = useAtom(atomSocket);

  const { data: conversation, isLoading } = trpc.chat.getConversation.useQuery(
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
    }
  );

  socket?.on(
    "receivedMessage",
    async (data: RouterOutputs["chat"]["sendMessage"]) => {
      await utils.chat.getConversation.cancel();
      utils.chat.getConversation.setData({ id: id as string }, (oldData) => {
        if (oldData?.Message.find((message) => message.id === data.id)) {
          return oldData;
        }
        return {
          ...oldData,
          Message: [...(oldData?.Message || []), data],
        } as typeof oldData;
      });
    }
  );

  const isIncoming = (message: MessageType) => {
    return message.userId !== session?.user?.id;
  };

  const isOutgoing = (message: MessageType) => {
    return message.userId === session?.user?.id;
  };

  const currentUser = session?.user;

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket?.emit("sendMessage", {
      conversationId: id,
      content: inputRef.current?.value,
    });

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <MessagesLayout>
      <header className="align-center fixed right-0 flex w-3/4 items-center justify-center bg-white p-4 pt-24 shadow-md">
        <p className="mr-4 flex items-center text-lg">
          Messages with
          {isLoading ? (
            <NameSkeleton />
          ) : (
            <span className="ml-1 font-bold">
              {conversation?.Follow.user?.name ||
                conversation?.Follow.user?.email?.split("@")[0]}
            </span>
          )}
        </p>
      </header>
      <main className="ml-auto flex min-h-screen w-3/4 flex-col gap-2 p-4 pt-48 pb-20 shadow-md">
        <div className="flex flex-col gap-4">
          <div className="align-end flex flex-col items-end justify-end gap-2 pb-2">
            {conversation?.Message.map((message) => {
              if (isIncoming(message)) {
                return (
                  <Message
                    key={message.id}
                    avatar={message.user?.image as string}
                    name={
                      (message.user?.name ||
                        message.user.email?.split("@")[0]) as string
                    }
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

const NameSkeleton = () => {
  return (
    <span className="ml-1 h-4 w-24 animate-pulse rounded-full bg-slate-300"></span>
  );
};
