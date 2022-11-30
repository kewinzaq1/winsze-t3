import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "src/components/common/Button";
import { FormGroup } from "src/components/common/FormGroup";
import { Input } from "src/components/common/Input";
import { Label } from "src/components/common/Label";
import { trpc } from "src/utils/trpc";
import { z } from "zod";

export function AccountUpdatePassword() {
  const { mutate, isLoading, error } =
    trpc.account.updatePassword.useMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(
      z.object({
        currentPassword: z.string().min(8),
        newPassword: z.string().min(8),
      })
    ),
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (value: any) => {
    console.log(value);
    mutate(value);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-4 flex w-full flex-col items-start"
    >
      <h2 className="text-2xl font-semibold">Update Password</h2>
      {error && <p className="m-0 p-0 text-sm text-red-500">{error.message}</p>}
      <FormGroup className="w-full">
        <Label>Current Password</Label>
        {errors.currentPassword && (
          <p className="m-0 p-0 text-xs text-red-500">
            {errors.currentPassword.message as string}
          </p>
        )}
        <Input
          className="w-full"
          type="password"
          placeholder="Current password"
          {...register("currentPassword")}
          error={Boolean(errors.currentPassword)}
        />
      </FormGroup>
      <FormGroup className="w-full">
        <Label>New Password</Label>
        {errors.newPassword && (
          <p className="m-0 p-0 text-xs text-red-500">
            {errors.newPassword.message as string}
          </p>
        )}
        <Input
          className="w-full"
          type="password"
          placeholder="New Password"
          {...register("newPassword")}
          error={Boolean(errors.newPassword)}
        />
      </FormGroup>
      <Button
        type="submit"
        className="mt-5 w-full text-center"
        isLoading={isLoading}
        variant={isLoading ? "primary" : "secondary"}
      >
        Update
      </Button>
    </form>
  );
}
