import { SignIn } from "src/components/auth/SignIn";

export default function SignInPage() {
  return <SignIn />;
}

export const getServerSideProps = () => {
  return {
    props: {
      withoutNavbar: true,
    },
  };
};
