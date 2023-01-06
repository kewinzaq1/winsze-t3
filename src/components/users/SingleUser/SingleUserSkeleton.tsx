import { PostSkeletons } from "src/components/feed/post/PostSkeletons";

export const SingleUserSkeleton = () => (
  <div className="animation-pulse mx-auto flex w-screen max-w-xl flex-col pt-24">
    <SingleUserHeaderSkeleton />
    <div className="mt-12 flex w-full flex-col gap-4">
      <PostSkeletons length={4} />
    </div>
  </div>
);

const SingleUserHeaderSkeleton = () => (
  <header className="flex w-full flex-col gap-2">
    <div className="flex w-full items-center justify-between gap-2">
      <div className="h-20 w-20 rounded-full bg-gray-300 object-cover" />

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-1">
          <div className="h-10 w-24 rounded-full bg-gray-300 text-4xl"></div>
          <div className="h-10 w-36 rounded-full bg-gray-300 text-4xl"></div>
        </div>
        <div className="flex items-center justify-between gap-1">
          <div className="h-8 w-full rounded-full bg-gray-300"></div>
          <p className="h-8 w-12 rounded-full bg-gray-300"></p>
        </div>
      </div>
    </div>
  </header>
);
