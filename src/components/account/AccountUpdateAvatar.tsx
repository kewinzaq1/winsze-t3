import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AuthButton } from "src/components/auth/AuthButton";
import { AuthFormGroup } from "src/components/auth/AuthFormGroup";
import { AuthInput } from "src/components/auth/AuthInput";
import { AuthLabel } from "src/components/auth/AuthLabel";
import { trpc } from "src/utils/trpc";
import { z } from "zod";

export function AccountUpdateAvatar() {
  const { mutate, isLoading, error, data } =
    trpc.account.updateAvatar.useMutation();
  const {
    mutate: removeAvatar,
    isLoading: isRemovingAvatar,
    error: removeAvatarError,
  } = trpc.account.removeAvatar.useMutation({
    onSuccess: () => {
      setAvatar("");
    },
  });
  const session = useSession();
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    if (!avatar.length && session.data?.user?.image) {
      setAvatar(session.data.user?.image);
    }
  }, [avatar.length, session]);

  useEffect(() => {
    if (data) {
      setAvatar(data.image as string);
    }
  }, [data]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(
      z.object({
        avatar: z.any(),
      })
    ),
  });

  useEffect(() => {
    const subscription = watch((value) => {
      console.log(value);
      if (!value.avatar[0]) {
        return;
      }
      const url = URL.createObjectURL(value.avatar[0]);
      setAvatar(url);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (value: any) => {
    const { avatar } = value;

    const convertToBase64 = (file: File) => {
      return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);

        fileReader.onload = () => {
          resolve(fileReader.result);
        };

        fileReader.onerror = (error) => {
          reject(error);
        };
      });
    };

    const base64 = await convertToBase64(avatar[0]);

    mutate({ avatar: base64 });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2 className="text-2xl font-semibold">Update avatar</h2>
      <div className="flex w-full items-center justify-between">
        <AuthFormGroup className="flex w-full items-center justify-center">
          <label htmlFor="avatar">
            {Boolean(avatar.length) && (
              <div className="relative h-24 w-24 rounded-full">
                <Image
                  src={avatar}
                  alt="123"
                  fill
                  className="cover rounded-full"
                />
              </div>
            )}
          </label>
          <AuthInput
            id="avatar"
            className="hidden w-full"
            type="file"
            placeholder="Avatar"
            accept="image/png, image/jpeg"
            {...register("avatar")}
            error={Boolean(errors.avatar)}
          />
        </AuthFormGroup>
        <div className="col-start-2 row-start-1 flex flex-col gap-2">
          <AuthButton
            type="submit"
            className="mt-5 text-center"
            isLoading={isLoading}
          >
            Update
          </AuthButton>
          <AuthButton
            type="button"
            onClick={() => removeAvatar()}
            isLoading={isRemovingAvatar}
            variant="secondary"
          >
            Remove
          </AuthButton>
        </div>
      </div>
    </form>
  );
}
