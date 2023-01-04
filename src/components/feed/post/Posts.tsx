import { trpc } from "src/utils/trpc";
import { Post } from "./Post";
import { PostSkeletons } from "./PostSkeletons";

export const Posts = () => {
  const { data: posts, isLoading } = trpc.posts.getPosts.useQuery({});

  return (
    <div className="mx-auto mt-10 w-full max-w-xl">
      {posts?.map((post) => (
        <Post key={post.id} post={post} />
      ))}
      {isLoading && <PostSkeletons />}
    </div>
  );
};
