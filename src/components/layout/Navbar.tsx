import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import type { DetailedHTMLProps, HTMLAttributes, LegacyRef } from "react";
import { useRef } from "react";
import { useState } from "react";
import { Button } from "../common/Button";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import avatarPlaceholder from "src/images/avatar_placeholder.png";
import { useClickAway } from "src/hooks/useClickAway";

const NavbarAvatar = ({
  onClick,
  ...rest
}: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => {
  const { data: session } = useSession();

  return (
    <>
      <div {...rest}>
        {session?.user && (
          <Image
            className="cursor-pointer rounded-full object-cover transition active:scale-95"
            src={session.user.image || avatarPlaceholder}
            width={40}
            height={40}
            alt={`${session?.user?.name || session?.user?.email}`}
            title={"open menu"}
            onClick={onClick}
          />
        )}
      </div>
    </>
  );
};

export const Navbar = () => {
  const { status } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const [animationParent] = useAutoAnimate();

  const toggleMenu = () => {
    setIsOpen((c) => !c);
  };

  const ref = useRef<HTMLDivElement>(null);
  useClickAway(ref, () => setIsOpen(false));

  return (
    <div ref={animationParent as LegacyRef<HTMLDivElement>}>
      <nav className="fixed z-50 flex w-full items-center justify-between overflow-x-hidden rounded-b-md bg-white bg-opacity-80 p-4 text-slate-700 shadow-md backdrop-blur">
        <div className="text-violetPrimary flex-1 font-bold uppercase">
          winsze t3
        </div>
        <div className="flex items-center justify-end gap-2 px-2">
          {status === "unauthenticated" || status === "loading" ? (
            <>
              <Link href="/sign-up">
                <Button variant="secondary" className="!p-2 text-sm">
                  Join us
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button className="!p-2 text-sm">Login</Button>
              </Link>
            </>
          ) : (
            <NavbarAvatar onClick={toggleMenu} />
          )}
        </div>
      </nav>
      {isOpen && (
        <div
          ref={ref}
          role="menu"
          className="fixed top-16 right-4 z-50 flex h-max flex-col gap-1 rounded-md bg-white bg-opacity-80 p-1 backdrop-blur"
        >
          <div className="z-50 flex h-full flex-col gap-1">
            <Link
              href="/account"
              className="rounded-sm bg-slate-50 p-2 transition hover:bg-slate-300"
            >
              Account
            </Link>
            <p
              onClick={() => signOut()}
              className="rounded-sm bg-slate-50 p-2 transition hover:bg-slate-300"
            >
              Logout
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
