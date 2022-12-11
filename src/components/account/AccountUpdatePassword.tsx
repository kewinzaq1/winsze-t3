import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "src/components/common/Button";
import { FormGroup } from "src/components/common/FormGroup";
import { Input } from "src/components/common/Input";
import { Label } from "src/components/common/Label";
import { trpc } from "src/utils/trpc";
import { z } from "zod";
import { ErrorMessage } from "../common/ErrorMessage";
import svg from "src/assets/undraw_secure_server_re_8wsq.svg";
import Image from "next/image";

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
        currentPassword: z
          .string()
          .min(8, "Password must be at least 8 characters long"),
        newPassword: z
          .string()
          .min(8, "Password must be at least 8 characters long"),
      })
    ),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
    },
  });

  const onSubmit = handleSubmit((value) => {
    mutate(value);
  });

  return (
    <form onSubmit={onSubmit} className="grid grid-cols-2">
      <div className="p-4">
        <h2 className="text-2xl font-semibold">Update Password</h2>
        {error && <ErrorMessage>{error.message}</ErrorMessage>}
        <Image
          src={svg}
          alt="secure server"
          width={400}
          height={400}
          className="p-4"
        />
      </div>
      <div className="flex h-full w-full flex-col items-center justify-center gap-4">
        <FormGroup className="mt-0 w-full">
          <Label>Current Password</Label>
          <Input
            className="w-full"
            type="password"
            placeholder="Current password"
            {...register("currentPassword")}
            error={errors.currentPassword}
          />
        </FormGroup>
        <FormGroup className="mt-0 w-full">
          <Label>New Password</Label>
          <Input
            className="w-full"
            type="password"
            placeholder="New Password"
            {...register("newPassword")}
            error={errors.newPassword}
          />
        </FormGroup>
        <Button
          type="submit"
          className="mt-2 w-full text-center"
          isLoading={isLoading}
        >
          Update
        </Button>
      </div>
    </form>
  );
}
