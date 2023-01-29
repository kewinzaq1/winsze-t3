import type { RouterOutputs } from "src/utils/trpc";
import { trpc } from "src/utils/trpc";
import Image from "next/image";
import avatarPlaceholder from "src/images/avatar_placeholder.png";
import { useRouter } from "next/router";
import { useNotifier } from "../notifier";

export const Follower = ({
  user,
}: {
  user: RouterOutputs["follow"]["getFollowers"][number];
}) => {
  const utils = trpc.useContext();
  const router = useRouter();
  const { show } = useNotifier();

  const { id } = router.query;

  const { mutateAsync: createConversation } =
    trpc.chat.createConversation.useMutation({
      onError(err) {
        show({
          message: "Error",
          description: err.message,
          type: "error",
          closable: true,
        });
      },
      onSuccess() {
        utils.invalidate();
      },
    });

  const pushToUserConversation = async () => {
    if (user.Conversation?.id) {
      await router.push(`/messages/${user.Conversation?.id}`);
      return;
    }
    const conversation = await createConversation({ followId: user.id });
    router.push(`/messages/${conversation.id}`);
  };

  return (
    <li>
      <div onClick={pushToUserConversation} className="flex flex-col gap-1">
        <div
          className={`flex items-center gap-2 rounded-md bg-slate-50 p-4 shadow-sm ${
            id === user.conversationId ? "!bg-slate-200" : ""
          }`}
        >
          <Image
            src={user.user.image ?? avatarPlaceholder}
            alt="avatar"
            className="h-12 w-12 rounded-full"
            width="48"
            height="48"
          />
          <div className="flex flex-col gap-1 truncate">
            <p className="font-semibold">
              {user.user.name || user.user.email?.split("@")[0]}
            </p>
            <p>{user.user.email}</p>
          </div>
        </div>
      </div>
    </li>
  );
};
