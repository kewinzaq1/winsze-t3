import { trpc } from "src/utils/trpc";

export default function Test() {
  const { mutate: createRandomUsers } =
    trpc.example.createRandomUsers.useMutation();
  const { mutate: createRandomPosts } =
    trpc.example.createRandomPosts.useMutation();

  return (
    <div className="flex w-screen justify-between pt-24">
      <h1>Test</h1>
      <button onClick={() => createRandomPosts()}>create posts</button>
      <button onClick={() => createRandomUsers()}>create users</button>
    </div>
  );
}
