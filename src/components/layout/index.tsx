import { Notifier } from "../notifier";
import { Navbar } from "./Navbar";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export const Layout = ({
  children,
  withoutNavbar,
}: {
  children: React.ReactNode;
  withoutNavbar: boolean;
}) => {
  return (
    <>
      {!withoutNavbar && <Navbar />}
      <ReactQueryDevtools />
      <Notifier />
      {children}
    </>
  );
};
