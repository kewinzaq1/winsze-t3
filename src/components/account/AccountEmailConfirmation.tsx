import { Button } from "src/components/common/Button";
import { trpc } from "src/utils/trpc";
import { useNotifier } from "../notifier";

export function AccountEmailConfirmation() {
  const { show } = useNotifier();
  const { mutate, isLoading } = trpc.account.sendVerifyEmail.useMutation({
    onSuccess: () => {
      show({
        message: "Email sent",
        description: "We have sent you a new confirmation email",
        type: "success",
      });
    },
    onError: (err) => {
      show({
        message: "Error",
        description: err.message,
        type: "error",
      });
    },
  });

  return (
    <div className="relative mt-4 flex h-full w-full flex-col items-start">
      <p className="text-2xl font-semibold">Verify email</p>
      <Button
        type="submit"
        className="mt-5 w-full text-center"
        isLoading={isLoading}
        onClick={() => mutate()}
      >
        Update
      </Button>
    </div>
  );
}
