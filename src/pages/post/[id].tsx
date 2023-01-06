import { useRouter } from "next/router";
import { LoadingWithQuote } from "src/components/common/LoadingWithQuote";
import { Post } from "src/components/feed/post/Post";
import { PostSkeleton } from "src/components/feed/post/PostSkeleton";
import { trpc } from "src/utils/trpc";

export default function SinglePost() {
  const router = useRouter();
  const id = router.query.id as string;

  const { data: post, isLoading } = trpc.posts.getPost.useQuery(
    {
      id: id ?? "",
    },
    { enabled: Boolean(id) }
  );

  return (
    <div className="mx-auto flex h-screen w-screen max-w-xl items-center justify-center">
      {post && <Post post={post} singlePost></Post>}
      {isLoading && <PostSkeleton />}
    </div>
  );
}
