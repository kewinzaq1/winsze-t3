import { useRouter } from "next/router";
import { useEffect } from "react";
import { LoadingWithQuote } from "src/components/common/LoadingWithQuote";
import { useNotifier } from "src/components/notifier";
import { trpc } from "src/utils/trpc";

export default function VerifyEmailPage() {
  const { show } = useNotifier();
  const router = useRouter();
  const { mutate: verifyToken } = trpc.account.verifyEmail.useMutation({
    onSuccess: () => {
      show({
        message: "Email verified",
        description: "Your email has been verified",
        type: "success",
      });
      router.push("/account");
    },
    onError: (err) => {
      show({
        message: "Error",
        description: err.message,
        type: "error",
      });
      router.push("/account");
    },
  });

  useEffect(() => {
    const token = router.query.token as string;
    if (token) {
      verifyToken(token);
    }
  }, [router.query.token, verifyToken]);

  return <LoadingWithQuote />;
}
