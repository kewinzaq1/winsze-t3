import dayjs from "dayjs";
import relativeRime from "dayjs/plugin/relativeTime";
import updateLocale from "dayjs/plugin/updateLocale";
import type { RouterOutputs } from "src/utils/trpc";
import { PostProvider } from "./PostContext";
import { BasePost } from "./BasePost";

dayjs.extend(relativeRime);
dayjs.extend(updateLocale);
dayjs.updateLocale("en", {
  relativeTime: {
    future: "in %s",
    past: "%s ago",
    s: "a few seconds",
    m: "1m",
    mm: "%dm",
    h: "1h",
    hh: "%dh",
    d: "1d",
    dd: "%dd",
    M: "1M",
    MM: "%dM",
    y: "1y",
    yy: "%dy",
  },
});

export type PostType = RouterOutputs["posts"]["getPosts"][number];

interface Props {
  post: PostType;
  userId?: string;
  singlePost?: boolean;
}

export const Post = (props: Props) => {
  return (
    <PostProvider {...props}>
      <BasePost />
    </PostProvider>
  );
};
