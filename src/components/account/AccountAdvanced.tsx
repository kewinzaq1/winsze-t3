import { AccountEmailConfirmation } from "./AccountEmailConfirmation";
import { AccountRemoveAccount } from "./AccountRemoveAccount";
import { AccountUpdateAvatar } from "./AccountUpdateAvatar";

export const AccountAdvanced = () => {
  return (
    <>
      <div className="col-span-3 h-1 w-full border border-transparent border-t-slate-500"></div>
      <div className="col-span-3 grid grid-cols-2 gap-10">
        <div>
          <p className="text-4xl font-bold">More actions</p>
          <p className="font-light">
            Update your account information and password.
          </p>
        </div>
        <AccountUpdateAvatar />
        <div className="col-start-2 flex items-center gap-10">
          <AccountEmailConfirmation />
          <AccountRemoveAccount />
        </div>
      </div>
    </>
  );
};
