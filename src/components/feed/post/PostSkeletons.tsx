import { PostSkeleton } from "./PostSkeleton";

export const PostSkeletons = ({ length }: { length?: number }) => {
  return (
    <div className="animate-pulse">
      {new Array(length || 6).map((_, i) => (
        <PostSkeleton key={i} />
      ))}
    </div>
  );
};
