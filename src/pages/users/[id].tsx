import { useRouter } from "next/router";
import { PostType } from "src/components/feed/post/Post";
import { trpc } from "src/utils/trpc";

export default function SingleUserPage() {
  const router = useRouter();
  const { id } = router.query;
  if (!id) {
    return <></>;
  }

  const { data: user } = trpc.users.getUser.useQuery({ id: `${id}` });

  return (
    <div className="max-auto mx-auto flex max-w-xl flex-col items-center justify-center pt-24">
      <header>
        <h1 className="text-4xl">{user?.name || user?.email}</h1>
        <div className="flex flex-col"></div>
      </header>
      {user?.Post.map((post) => (
        <Post key={post.id} post={post} userId={id.toString()} />
      ))}
    </div>
  );
}
