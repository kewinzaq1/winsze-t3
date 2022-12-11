import { AccountHeader } from "src/components/account/AccountHeader";
import { AccountRemoveAccount } from "src/components/account/AccountRemoveAccount";
import { AccountUpdateAvatar } from "src/components/account/AccountUpdateAvatar";
import { AccountUpdateEmail } from "src/components/account/AccountUpdateEmail";
import { AccountUpdatePassword } from "src/components/account/AccountUpdatePassword";

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-slate-300">
      <AccountHeader />
      <div className="glass mx-auto grid max-w-7xl gap-4 rounded-md pt-24 shadow-md md:grid-cols-2">
        <AccountUpdatePassword />
        {/* <AccountUpdateEmail />
        <AccountRemoveAccount />
        <AccountUpdateAvatar /> */}
      </div>
    </div>
  );
}
