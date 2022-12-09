import { zodResolver } from "@hookform/resolvers/zod";
import { signOut } from "next-auth/react";
import { useForm } from "react-hook-form";
import { Button } from "src/components/common/Button";
import { FormGroup } from "src/components/common/FormGroup";
import { Input } from "src/components/common/Input";
import { Label } from "src/components/common/Label";
import { trpc } from "src/utils/trpc";
import { z } from "zod";
import { ErrorMessage } from "../common/ErrorMessage";

export function AccountRemoveAccount() {
  const { mutate, isLoading, error } = trpc.account.removeAccount.useMutation({
    onSuccess: () => {
      signOut({ callbackUrl: "/sign-in" });
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(
      z.object({
        password: z.string().min(8, "Password must be at least 8 characters"),
      })
    ),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = handleSubmit((value) => {
    mutate(value);
  });

  return (
    <form
      onSubmit={onSubmit}
      className="relative mt-4 flex h-full w-full flex-col items-start"
    >
      <h2 className="text-2xl font-semibold">Remove account</h2>
      {error && <ErrorMessage>{error.message}</ErrorMessage>}
      <FormGroup className="w-full">
        <Label>Confirm password</Label>
        {errors.password && (
          <p className="m-0 p-0 text-xs text-red-500">
            {errors.password.message as string}
          </p>
        )}
        <Input
          className="w-full"
          type="password"
          placeholder="Password"
          {...register("password")}
          error={Boolean(errors.password)}
        />
      </FormGroup>
      <Button
        type="submit"
        className="mt-5 w-full text-center"
        isLoading={isLoading}
        variant="error"
      >
        Remove account
      </Button>
    </form>
  );
}
