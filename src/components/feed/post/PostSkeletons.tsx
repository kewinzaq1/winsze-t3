import { PostSkeleton } from "./PostSkeleton";

export const PostSkeletons = ({ length }: { length?: number }) => {
  const arr = new Array(length || 6).fill(0);

  return (
    <>
      {arr.map((_, index) => (
        <PostSkeleton key={index} />
      ))}
    </>
  );
};
