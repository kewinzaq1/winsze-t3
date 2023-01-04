import { AiFillHeart } from "react-icons/ai";
import { BsFillShareFill } from "react-icons/bs";
import { FaComments } from "react-icons/fa";

export const PostSkeleton = () => (
  <div className="relative flex w-full select-none flex-col rounded-md p-4 shadow-md">
    <div className="flex py-2">
      <div className="h-16 w-16 rounded-full bg-gray-300 object-cover" />
      <div className="ml-2 flex flex-col gap-2">
        <div className="h-2 w-24 rounded-full bg-gray-300 text-xs"></div>
        <div className="h-4 w-36 rounded-full bg-gray-300 text-sm opacity-40"></div>
        <div className="h-4 w-56 rounded-full bg-gray-300 text-xl font-light"></div>
      </div>
    </div>
    <div className="mt-2 flex flex-col">
      <p className="text-2xl"></p>
      <div className="mt-2 h-56 w-full rounded-md bg-gray-300 object-contain" />
      <div className="flex w-full items-center">
        <button className="flex items-center gap-1">
          <AiFillHeart className="h-8 w-8 text-gray-300" />
        </button>
        <button
          className="flex items-center gap-1 rounded-md p-2"
          aria-label="show comments"
          title="show comment"
        >
          <FaComments className="h-8 w-8 text-gray-300" />
        </button>
        <button
          className="ml-auto justify-self-end rounded-md p-2"
          aria-label="share post"
          title="share-post"
        >
          <BsFillShareFill className="h-6 w-6 text-gray-300" />
        </button>
      </div>
    </div>
  </div>
);
