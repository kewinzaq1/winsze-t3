import { Notifier } from "../notifier";
import { Navbar } from "./Navbar";

export const Layout = ({
  children,
  withoutNavbar,
}: {
  children: React.ReactNode;
  withoutNavbar: boolean;
}) => {
  return (
    <>
      <Notifier />
      {!withoutNavbar && <Navbar />}
      {children}
    </>
  );
};
