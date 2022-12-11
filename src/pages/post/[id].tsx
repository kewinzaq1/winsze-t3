import { useRouter } from "next/router";
import { LoadingWithQuote } from "src/components/common/LoadingWithQuote";
import { Post } from "src/components/feed/post/Post";
import { trpc } from "src/utils/trpc";

export default function SinglePost() {
  const router = useRouter();
  const id = router.query.id as string;

  const { data: post } = trpc.posts.getPost.useQuery({
    id,
  });

  if (!post) {
    return <LoadingWithQuote />;
  }

  return (
    <div className="mx-auto flex h-screen w-screen max-w-xl items-center justify-center">
      <Post {...post}></Post>
    </div>
  );
}
