import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import type { ReactNode } from "react";
import { useIsMobile } from "src/hooks/useIsMobile";
import { trpc } from "src/utils/trpc";
import { useInitWebsocket } from "src/utils/useInitWebSocket";
import { ConversationCard } from "./ConverationCard";
import { ConversationCardSkeleton } from "./ConversationCardSkeleton";

export const MessagesLayout = ({ children }: { children: ReactNode }) => {
  useInitWebsocket();

  const { id } = useRouter().query;

  const isMobile = useIsMobile();

  return (
    <>
      {!isMobile && (
        <>
          <aside className="fixed hidden h-screen w-1/4 rounded-md bg-slate-300 pt-24 shadow-md md:block">
            <h1 className="text-center text-2xl font-bold">Messages</h1>
            <hr className="my-4" />
            <UsersList />
          </aside>
          {children}
        </>
      )}
      {isMobile && !id && (
        <main className="flex h-screen w-screen flex-col pt-24 md:hidden">
          <h1 className="text-center text-2xl font-bold">Messages</h1>
          <hr className="my-4" />
          <UsersList />
        </main>
      )}
      {isMobile && id && children}
    </>
  );
};

const UsersList = () => {
  const { data: session } = useSession();
  const { data, isLoading } = trpc.chat.getAllConversations.useQuery();
  const SKELETONS_ARR = new Array(8).fill(0);

  const users = data?.map((conversation) => {
    const otherUser = conversation.participants.find(
      (user) => user.id !== session?.user?.id
    );

    return {
      conversation,
      user: otherUser,
    };
  });

  return (
    <ul className="flex h-full flex-col gap-2 overflow-y-auto px-4 pb-20">
      {users?.map(
        (user) =>
          user.user && (
            <ConversationCard
              key={user.user.id}
              user={user.user}
              conversationId={user.conversation.id}
            />
          )
      )}
      {isLoading &&
        SKELETONS_ARR.map((_, i) => <ConversationCardSkeleton key={i} />)}
    </ul>
  );
};
