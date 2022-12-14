import { trpc } from "src/utils/trpc";
import { CreateComment } from "./CreateComment";
import { Comment } from "./Comment";

export const Comments = ({ postId }: { postId: string }) => {
  const { data: comments } = trpc.posts.getPostComments.useQuery({ postId });

  return (
    <div className="mt-4 h-max w-full border-2 border-transparent border-t-slate-200">
      <CreateComment postId={postId} />
      {comments?.map((comment) => (
        <Comment key={comment.id} {...comment} />
      ))}
    </div>
  );
};
