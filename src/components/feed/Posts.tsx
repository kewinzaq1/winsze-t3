import { trpc } from "src/utils/trpc";
import { Post } from "./Post";

export const Posts = () => {
  const { data } = trpc.posts.getPosts.useQuery({});

  console.log(data);
  return (
    <div className="mx-auto mt-10 w-full max-w-3xl">
      {data?.map((post) => (
        <Post key={post.id} {...post} />
      ))}
    </div>
  );
};
