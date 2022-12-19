import { Notifier } from "../notifier";
import { Navbar } from "./Navbar";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Submenu } from "./Submenu";

export const Layout = ({
  children,
  withoutNavbar,
}: {
  children: React.ReactNode;
  withoutNavbar: boolean;
}) => {
  return (
    <>
      <ReactQueryDevtools />
      <Notifier />
      {/* TODO: submenu will be only in pages that are includes in submenu */}
      <Submenu />
      {!withoutNavbar && <Navbar />}
      {children}
    </>
  );
};
