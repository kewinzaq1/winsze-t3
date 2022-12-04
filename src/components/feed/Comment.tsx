import type { RouterOutputs } from "src/utils/trpc";
import avatarPlaceholder from "src/images/avatar_placeholder.png";
import Image from "next/image";
import dayjs from "dayjs";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { useSession } from "next-auth/react";

export const Comment = (comment: RouterOutputs["posts"]["addComment"]) => {
  const userIsAuthor = comment?.user.id === useSession().data?.user?.id;

  return (
    <div className="mt-4">
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
        {userIsAuthor && (
          <BiDotsHorizontalRounded
            className="ml-auto h-6 w-6"
            role="button"
            tabIndex={0}
            aria-label="manage post"
            title="manage post"
          />
        )}
      </header>
      <div>
        <p>{comment?.content}</p>
      </div>
    </div>
  );
};
