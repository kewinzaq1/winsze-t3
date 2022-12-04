import type { RouterOutputs } from "src/utils/trpc";
import { trpc } from "src/utils/trpc";
import avatarPlaceholder from "src/images/avatar_placeholder.png";
import Image from "next/image";
import dayjs from "dayjs";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useNotifier } from "src/components/notifier";
import { CommentMenuButton } from "./CommentMenuButton";
import { CommentMenu } from "./CommentMenu";

export const Comment = (comment: RouterOutputs["posts"]["addComment"]) => {
  const [openMenu, setOpenMenu] = useState(false);
  const { show } = useNotifier();

  const { mutate: deleteComment } = trpc.posts.deleteComment.useMutation({
    onSuccess: () => {
      setOpenMenu(false);
      show({
        type: "success",
        message: "Comment deleted",
        description: "Your comment has been deleted",
      });
    },
    onError: (error) => {
      show({
        type: "error",
        message: "Error deleting comment",
        description: error.message,
      });
    },
  });

  const userIsAuthor = comment?.user.id === useSession().data?.user?.id;

  console.log(useSession().data?.user?.id);

  return (
    <div className="relative mt-4">
      <header className="flex items-center">
        <Image
          src={comment?.user.image ?? avatarPlaceholder}
          width={50}
          height={50}
          alt={`${comment?.user?.name}`}
          className="h-12 w-12 rounded-full object-cover"
        />
        <div className="ml-2 flex flex-col">
          <p className="text-xs">{dayjs(comment?.createdAt).fromNow()}</p>
          <p className="text-lg">
            {comment?.user.name || comment?.user.email?.split("@")[0]}
          </p>
        </div>
        {userIsAuthor && !openMenu && (
          <BiDotsHorizontalRounded
            onClick={() => setOpenMenu((c) => !c)}
            className="ml-auto h-6 w-6"
            role="button"
            tabIndex={0}
            aria-label="manage post"
            title="manage post"
          />
        )}
        {openMenu && (
          <CommentMenu setOpenMenu={setOpenMenu}>
            <CommentMenuButton>Edit</CommentMenuButton>
            <CommentMenuButton>Delete</CommentMenuButton>
          </CommentMenu>
        )}
      </header>
      <div>
        <p>{comment?.content}</p>
      </div>
    </div>
  );
};
