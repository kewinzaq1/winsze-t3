import { useRouter } from "next/router";
import { LoadingWithQuote } from "src/components/common/LoadingWithQuote";
import { PostType } from "src/components/feed/post/Post";
import { trpc } from "src/utils/trpc";

export default function SinglePost() {
  const router = useRouter();
  const id = router.query.id as string;

  const { data: post, isLoading } = trpc.posts.getPost.useQuery({
    id: id ?? "",
  });

  if (isLoading) {
    return <LoadingWithQuote />;
  }

  if (!post) {
    return <h1 className="mx-auto text-3xl">Post not found</h1>;
  }

  return (
    <div className="mx-auto flex h-screen w-screen max-w-xl items-center justify-center">
      <Post post={post} singlePost></Post>
    </div>
  );
}
