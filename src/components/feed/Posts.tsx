import Image from "next/image";
import type { RouterOutputs } from "src/utils/trpc";
import { trpc } from "src/utils/trpc";

const Post = (post: RouterOutputs["posts"]["getPosts"][number]) => {
  return (
    <div className="flex w-full flex-col">
      <div className="flex">
        <Image
          src={`${post.user.image}`}
          width={50}
          height={50}
          alt={`${post.user.name}`}
          className="rounded-full object-cover"
        />
        <div className="ml-2 flex flex-col">
          <p className="text-sm font-bold">{post.user.email}</p>
          <p className="text-lg font-light">
            {post.user.name || post.user.email?.split("@")[0]}
          </p>
        </div>
      </div>
      <div className="mt-2 flex flex-col">
        <p className="text-3xl">{post.content}</p>
        {post.image && (
          <Image
            width={100}
            height={100}
            src={post.image}
            alt={post.image}
            className="mt-2 h-48 w-full object-contain"
          />
        )}
      </div>
      <div className="flex items-center">
        <button>like</button>
        <button>comment</button>
        <button>share</button>
      </div>
    </div>
  );
};

export const Posts = () => {
  const { data } = trpc.posts.getPosts.useQuery({});

  console.log(data);
  return (
    <div className="mx-auto mt-10 w-full max-w-3xl px-4">
      {data?.map((post) => (
        <Post key={post.id} {...post} />
      ))}
    </div>
  );
};
