import { signIn } from "next-auth/react";
import { BsGoogle, BsFacebook } from "react-icons/bs";
import { AuthButton } from "./AuthButton";

export const AuthOtherMethods = () => {
  return (
    <div className="mt-10 flex flex-col">
      <p className="col-span-2 mb-2 text-sm text-slate-600">Other methods?</p>
      <div className="flex items-center gap-2">
        <AuthButton
          variant="secondary"
          onClick={async () => await signIn("google")}
        >
          <BsGoogle className="mr-2 text-xl" />
          Google
        </AuthButton>
        <AuthButton
          variant="secondary"
          onClick={async () => await signIn("facebook")}
        >
          <BsFacebook className="mr-2 text-xl" />
          Facebook
        </AuthButton>
      </div>
    </div>
  );
};
