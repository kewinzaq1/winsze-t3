import { trpc } from "src/utils/trpc";
import { Post } from "./Post";

export const Posts = () => {
  const { data } = trpc.posts.getPosts.useQuery({});

  return (
    <div className="mx-auto mt-10 w-full max-w-xl">
      {data?.map((post) => (
        <Post key={post.id} {...post} />
      ))}
    </div>
  );
};
