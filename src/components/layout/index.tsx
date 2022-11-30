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
      {!withoutNavbar && <Navbar />}
      {children}
    </>
  );
};
