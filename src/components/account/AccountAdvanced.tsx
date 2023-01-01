import { AccountEmailConfirmation } from "./AccountEmailConfirmation";
import { AccountRemoveAccount } from "./AccountRemoveAccount";
import { AccountUpdateAvatar } from "./AccountUpdateAvatar";

export const AccountAdvanced = () => {
  return (
    <>
      <div className="h-1 w-full border border-transparent border-t-slate-500 md:col-span-3"></div>
      <div className="grid gap-10 md:col-span-3 md:grid-cols-2">
        <div>
          <p className="text-4xl font-bold">More actions</p>
          <p className="font-light">
            Update your account information and password.
          </p>
        </div>
        <AccountUpdateAvatar />
        <div className="flex items-center gap-10 md:col-start-2">
          <AccountEmailConfirmation />
          <AccountRemoveAccount />
        </div>
      </div>
    </>
  );
};
