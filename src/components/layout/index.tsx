import { Notifier } from "../notifier";
import { Navbar } from "./Navbar";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

<<<<<<< HEAD
export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
=======
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
      {!withoutNavbar && <Navbar />}
>>>>>>> origin/master
      {children}
    </>
  );
};
