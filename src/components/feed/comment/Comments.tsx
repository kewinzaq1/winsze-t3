import { trpc } from "src/utils/trpc";
import { CreateComment } from "./CreateComment";
import { Comment } from "./Comment";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { LegacyRef, useEffect } from "react";

export const Comments = ({ postId }: { postId: string }) => {
  const { data: comments } = trpc.posts.getPostComments.useQuery({ postId });

  const [ref] = useAutoAnimate();

  if (comments) {
    comments.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  return (
    <div
      className="mt-4 h-max w-full border-2 border-transparent border-t-slate-200"
      ref={ref as LegacyRef<HTMLDivElement>}
    >
      <CreateComment postId={postId} />
      {comments?.map((comment) => (
        <Comment key={comment.id} {...comment} />
      ))}
    </div>
  );
};
