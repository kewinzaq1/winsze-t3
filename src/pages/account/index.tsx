import { AccountAdvanced } from "src/components/account/AccountAdvanced";
import { AccountBasic } from "src/components/account/AccountBasic";
import { AccountHeader } from "src/components/account/AccountHeader";

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-slate-300 px-10">
      <AccountHeader />
      <div className="glass mx-auto grid max-w-7xl grid-cols-1 gap-5 !bg-opacity-50 !p-8 md:grid-cols-3">
        <AccountBasic />
        <AccountAdvanced />
      </div>
    </div>
  );
}
