import { Navbar } from "./Navbar";

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
      {!withoutNavbar && <Navbar />}
>>>>>>> origin/master
      {children}
    </>
  );
};
