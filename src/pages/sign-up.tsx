import { SignUp } from "src/components/auth/SignUp";

export default function SignUpPage() {
  return <SignUp />;
}

export const getServerSideProps = () => {
  return {
    props: {
      withoutNavbar: true,
    },
  };
};
