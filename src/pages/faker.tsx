import { trpc } from "src/utils/trpc";

export default function Faker() {
  const { mutate: createUsers } = trpc.example.createRandomUsers.useMutation();
  const { mutate: createPosts } = trpc.example.createRandomPosts.useMutation();

  return (
    <div className="pt-24">
      <h1>faker</h1>
      <button onClick={() => createUsers()}>Create random users</button>
      <button onClick={() => createPosts()}>create random posts</button>
    </div>
  );
}
