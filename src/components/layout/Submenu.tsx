import {
  MdArticle as FeedIcon,
  MdGroups as GroupsIcon,
  MdMessage as MessageIcon,
} from "react-icons/md";
import { HiUsers as UsersIcon } from "react-icons/hi";
import { SiEventstore as EventsIcon } from "react-icons/si";
import type { DetailedHTMLProps, HTMLAttributes } from "react";
import Link from "next/link";

export const Submenu = ({ currentPage }: { currentPage: string }) => {
  return (
    <div className="fixed bottom-0 right-0 left-0 mx-auto mt-24 flex w-max items-center justify-center gap-4 rounded-full bg-white px-4 py-4 shadow-md">
      <SubmenuButton active={currentPage === "feed"}>
        <Link href="/feed" className="flex items-center">
          <FeedIcon className="mr-1 text-lg" /> Feed
        </Link>
      </SubmenuButton>
      <SubmenuButton active={currentPage === "users"}>
        <Link href="/users" className="flex items-center">
          <UsersIcon className="mr-1 text-lg" /> Users
        </Link>
      </SubmenuButton>
      <SubmenuButton active={currentPage === "groups"}>
        <Link href="/groups" className="flex items-center">
          <GroupsIcon className="mr-1 text-lg" /> Groups
        </Link>
      </SubmenuButton>
      <SubmenuButton active={currentPage === "events"}>
        <Link href="/events" className="flex items-center">
          <EventsIcon className="mr-1 text-lg" /> Events
        </Link>
      </SubmenuButton>
      <SubmenuButton active={currentPage === "message"}>
        <Link href="/message" className="flex items-center">
          <MessageIcon className="mr-1 text-lg" /> Message
        </Link>
      </SubmenuButton>
    </div>
  );
};

type SubmenuButtonProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  active?: boolean;
};

export const SubmenuButton = ({
  className,
  active,
  ...rest
}: SubmenuButtonProps) => {
  return (
    <div
      className={`${className} text-semibold flex cursor-pointer items-center rounded-full bg-slate-400 p-4 text-white shadow-sm transition-all hover:shadow-lg ${
        active && "bg-gradient-to-r from-cyan-500 to-blue-500"
      }`}
      {...rest}
    />
  );
};
