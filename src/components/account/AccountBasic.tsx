import { useAutoAnimate } from "@formkit/auto-animate/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import type { LegacyRef } from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "src/components/common/Button";
import { FormGroup } from "src/components/common/FormGroup";
import { Input } from "src/components/common/Input";
import { Label } from "src/components/common/Label";
import { useNotifier } from "src/components/notifier";
import { trpc } from "src/utils/trpc";
import { z } from "zod";

export const AccountBasic = () => {
  const { show } = useNotifier();
  const [ref] = useAutoAnimate();

  const { mutate, isLoading } = trpc.account.updateAccount.useMutation({
    onSuccess: () => {
      show({
        message: "Account updated successfully",
        description: "Your account has been updated successfully.",
        type: "success",
      });
    },
    onError: (error) => {
      show({
        message: "Error updating account",
        description: error.message,
        type: "error",
      });
    },
  });

  const { data: session } = useSession();

  const passwordCondition = z
    .union([
      z.string().length(0, "Password must be at least 8 characters"),
      z.string().min(8, "Password must be at least 8 characters"),
    ])
    .optional()
    .transform((e) => (e === "" ? undefined : e));

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(
      z.object({
        name: z.optional(z.string().min(3).max(20)),
        email: z.optional(z.string().email("Invalid email address.")),
        newPassword: passwordCondition,
        passwordConfirmation: z
          .string()
          .min(8, "Password must be at least 8 characters"),
        password: z.string().min(8, "Password must be at least 8 characters"),
      })
    ),
    defaultValues: {
      name: "",
      email: "",
      newPassword: "",
      passwordConfirmation: "",
      password: "",
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutate(data);
  });

  useEffect(() => {
    if (session?.user?.name) {
      setValue("name", session?.user?.name);
    }
    if (session?.user?.email) {
      setValue("email", session?.user?.email);
    }
  }, [session, setValue]);

  return (
    <div className="col-span-3 grid grid-cols-2 gap-10">
      <div>
        <p className="text-4xl font-bold">Basic information</p>
        <p className="font-light">
          Update your account information and password.
        </p>
      </div>
      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-2"
        ref={ref as LegacyRef<HTMLFormElement>}
      >
        <FormGroup>
          <Label>Name</Label>
          <Input placeholder="Name" {...register("name")} error={errors.name} />
        </FormGroup>
        <FormGroup>
          <Label>Email</Label>
          <Input
            placeholder="Email"
            {...register("email")}
            error={errors.email}
          />
        </FormGroup>
        <FormGroup>
          <Label>New password</Label>
          <Input
            placeholder="your super secret password"
            {...register("newPassword")}
            error={errors.newPassword}
            type="password"
          />
        </FormGroup>
        {Boolean(watch("newPassword")[0]?.length) && (
          <FormGroup>
            <Label>Confirm new password</Label>
            <Input
              placeholder="your super secret password"
              {...register("passwordConfirmation")}
              error={errors.passwordConfirmation}
              type="password"
            />
          </FormGroup>
        )}
        <FormGroup>
          <Label>Current password</Label>
          <Input
            placeholder="Password"
            {...register("password")}
            error={errors.password}
            type="password"
          />
        </FormGroup>
        <Button type="submit" isLoading={isLoading}>
          Save
        </Button>
      </form>
    </div>
  );
};
