import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Button } from "src/components/common/Button";
import { FormGroup } from "src/components/common/FormGroup";
import { Input } from "src/components/common/Input";
import { Label } from "src/components/common/Label";
import { trpc } from "src/utils/trpc";
import { z } from "zod";
import { useNotifier } from "../notifier";

export function AccountUpdateName() {
  const { data: session } = useSession();
  const { show } = useNotifier();

  const { mutate, isLoading } = trpc.account.updateName.useMutation({
    onSuccess: () => {
      show({
        message: "Name updated",
        description: "Your name has been updated",
        type: "success",
      });
    },
    onError: (err) => {
      show({
        message: "Error updating name",
        description: err.message,
        type: "error",
      });
    },
  });

  const defaultName = useMemo(() => session?.user?.name ?? "", [session]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(
      z.object({
        name: z.string(),
      })
    ),
    defaultValues: {
      name: defaultName,
    },
  });

  const onSubmit = handleSubmit((value) => {
    mutate(value);
  });

  useEffect(() => {
    if (defaultName.length) {
      setValue("name", defaultName);
    }
  }, [defaultName, setValue]);

  return (
    <form
      onSubmit={onSubmit}
      className="relative mt-4 flex h-full w-full flex-col items-start"
    >
      <p className="text-2xl font-semibold">Name</p>
      <FormGroup className="w-full">
        <Label>Name</Label>
        <div className="place-content=center grid grid-cols-[80%,20%] items-center justify-items-center">
          <Input
            className="h-full w-full !p-3"
            placeholder="Name"
            {...register("name")}
            error={errors.name}
          />
          <Button
            type="submit"
            className="flex w-full items-center justify-center text-center"
            isLoading={isLoading}
          >
            Update
          </Button>
        </div>
      </FormGroup>
    </form>
  );
}
