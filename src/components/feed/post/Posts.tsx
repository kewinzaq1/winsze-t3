import { trpc } from "src/utils/trpc";
import { PostType } from "./Post";
import { PostSkeleton } from "./PostSkeleton";

export const Posts = () => {
  const { data: posts, isLoading } = trpc.posts.getPosts.useQuery({});

  return (
    <div className="mx-auto mt-10 w-full max-w-xl">
      {posts?.map((post) => (
        <Post key={post.id} post={post} />
      ))}
      {isLoading &&
        new Array(4).map((_, index) => <PostSkeleton key={index} />)}
    </div>
  );
};
