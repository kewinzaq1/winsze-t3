import { AccountEmailConfirmation } from "src/components/account/AccountEmailConfirmation";
import { AccountHeader } from "src/components/account/AccountHeader";
import { AccountRemoveAccount } from "src/components/account/AccountRemoveAccount";
import { AccountUpdateAvatar } from "src/components/account/AccountUpdateAvatar";
import { AccountUpdateEmail } from "src/components/account/AccountUpdateEmail";
import { AccountUpdateName } from "src/components/account/AccountUpdateName";
import { AccountUpdatePassword } from "src/components/account/AccountUpdatePassword";

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-slate-300">
      <AccountHeader />
      <div className="glass mx-auto grid max-w-7xl grid-cols-3 gap-5 !bg-opacity-50">
        <AccountUpdateAvatar />
        <AccountEmailConfirmation />
        <AccountUpdateName />
        <AccountUpdatePassword />
        <AccountUpdateEmail />
        <AccountRemoveAccount />
      </div>
    </div>
  );
}
