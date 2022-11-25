import { signIn, useSession } from "next-auth/react";
import { AccountRemoveAccount } from "src/components/account/AccountRemoveAccount";
import { AccountUpdateEmail } from "src/components/account/AccountUpdateEmail";
import { AccountUpdatePassword } from "src/components/account/AccountUpdatePassword";

export default function AccountPage() {
  const session = useSession();

  return (
    <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <AccountUpdatePassword />
      <AccountUpdateEmail />
      <AccountRemoveAccount />
      <div
        onClick={() =>
          signIn("email", { email: session.data?.user?.email, redirect: false })
        }
      >
        confirm email
      </div>
    </div>
  );
}
