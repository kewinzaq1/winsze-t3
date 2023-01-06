import Image from "next/image";
import Link from "next/link";
import type { DetailedHTMLProps, HTMLAttributes, LegacyRef } from "react";
import { useRef, useState } from "react";
import { Button } from "../common/Button";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import avatarPlaceholder from "src/images/avatar_placeholder.png";
import { useClickAway } from "src/hooks/useClickAway";
import { signOut, useSession } from "next-auth/react";

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

  const ref = useRef<HTMLDivElement>(null);
  useClickAway(ref, () => {
    const timeout = setTimeout(() => {
      setIsOpen(false);
    }, 100);
    if (!isOpen) {
      clearTimeout(timeout);
    }
  });

  return (
    <div>
      <nav className="fixed top-0 z-50 flex w-full items-center justify-between rounded-b-md bg-white bg-opacity-80 p-4 text-slate-700 shadow-md backdrop-blur overflow-x-hidden">
        <Link
          href={status === "authenticated" ? "/feed" : "/"}
          className="text-violetPrimary flex-1 font-bold uppercase"
        >
          winsze t3
        </Link>
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
            <NavbarAvatar
              onClick={() => {
                if (isOpen) {
                  return;
                }
                setIsOpen(true);
              }}
            />
          )}
        </div>
      </nav>
      <div ref={animationParent as LegacyRef<HTMLDivElement>}>
        {isOpen && (
          <div
            role="menu"
            className="fixed top-16 right-4 z-50 flex h-max flex-col gap-1 rounded-md bg-white bg-opacity-80 p-1 backdrop-blur"
          >
            <div className="z-50 flex h-full flex-col gap-1" ref={ref}>
              <Link
                href="/account"
                className="rounded-sm bg-slate-50 p-2 transition hover:bg-slate-300"
                onClick={() => setIsOpen(false)}
              >
                Account
              </Link>
              <p
                onClick={() => {
                  signOut({
                    redirect: true,
                    callbackUrl: `${window.location.origin}/`,
                  });
                  setIsOpen(false);
                }}
                className="cursor-pointer rounded-sm bg-slate-50 p-2 transition hover:bg-slate-300"
              >
                Logout
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
