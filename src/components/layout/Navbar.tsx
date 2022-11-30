import Link from "next/link";
import { useState } from "react";
import { Button } from "../common/Button";

export const Navbar = () => {
  return (
    <nav className="flex w-full items-center justify-between overflow-x-hidden rounded-b-md bg-white bg-opacity-80 p-4 text-slate-700 shadow-md backdrop-blur">
      <div className="flex-1 font-bold uppercase text-violetPrimary">
        winsze t3
      </div>
      <div className="flex flex-1 items-center justify-end gap-2">
        <Button variant="secondary" className="!p-2 text-sm">
          Join us
        </Button>
        <Button className="!p-2 text-sm">Login</Button>
      </div>
    </nav>
  );
};
