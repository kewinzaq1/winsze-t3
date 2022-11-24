import { AccountUpdatePassword } from "../components/account/AccountUpdatePassword";

export default function AccountPage() {
  return (
    <div className="mx-auto grid max-w-7xl md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <AccountUpdatePassword />
    </div>
  );
}
