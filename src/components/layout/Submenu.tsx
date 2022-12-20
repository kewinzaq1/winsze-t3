import {
  MdArticle as FeedIcon,
  MdGroups as GroupsIcon,
  MdMessage as MessageIcon,
} from "react-icons/md";
import { HiUsers as UsersIcon } from "react-icons/hi";
import { SiEventstore as EventsIcon } from "react-icons/si";
import type { DetailedHTMLProps, HTMLAttributes } from "react";

export const Submenu = () => {
  return (
    <div className="fixed bottom-0 right-0 left-0 mx-auto flex w-max items-center justify-center gap-4 rounded-md bg-white px-4  py-4">
      <SubmenuButton active>
        <FeedIcon className="mr-1 text-lg" /> Feed
      </SubmenuButton>
      <SubmenuButton>
        <UsersIcon className="mr-1 text-lg" /> Users
      </SubmenuButton>
      <SubmenuButton>
        <GroupsIcon className="mr-1 text-lg" /> Groups
      </SubmenuButton>
      <SubmenuButton>
        <EventsIcon className="mr-1 text-lg" /> Events
      </SubmenuButton>
      <SubmenuButton>
        <MessageIcon className="mr-1 text-lg" /> Message
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
