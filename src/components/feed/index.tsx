import { CreatePost } from "./post/CreatePost";
import { Posts } from "./post/Posts";

export const Feed = () => {
  return (
    <>
      <CreatePost />
      <Posts />
    </>
  );
};
