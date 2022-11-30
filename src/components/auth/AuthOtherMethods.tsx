import { signIn } from "next-auth/react";
import { BsGoogle, BsFacebook } from "react-icons/bs";
import { Button } from "../common/Button";

export const AuthOtherMethods = () => {
  return (
    <div className="mt-10 flex flex-col">
      <p className="col-span-2 mb-2 text-sm text-slate-600">Other methods?</p>
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          onClick={async () => await signIn("google")}
          className="!text-slate-900"
        >
          <BsGoogle className="mr-2 text-xl" />
          Google
        </Button>
        <Button
          variant="secondary"
          onClick={async () => await signIn("facebook")}
          className="!text-slate-900"
        >
          <BsFacebook className="mr-2 text-xl" />
          Facebook
        </Button>
      </div>
    </div>
  );
};
