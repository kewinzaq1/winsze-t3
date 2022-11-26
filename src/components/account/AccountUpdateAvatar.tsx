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
  const [avatar, setAvatar] = useState("");
  const session = useSession();

  useEffect(() => {
    if (session.data?.user?.image) {
      setAvatar(session.data.user.image);
    }
    if (data?.image && data.image !== avatar) {
      setAvatar(data?.image);
    }
    console.log({ avatar, session, data });
  }, [avatar, data, data?.image, session]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(
      z.object({
        avatar: z.any(),
      })
    ),
  });

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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="relative mt-4 flex h-full w-full flex-col items-start"
    >
      <h2 className="text-2xl font-semibold">Update avatar</h2>
      {error && (
        <p className="absolute top-8 m-0 p-0 text-sm text-red-500">
          {error.message}
        </p>
      )}
      <AuthFormGroup className="w-full">
        <AuthLabel>Avatar</AuthLabel>
        {errors.avatar && (
          <p className="m-0 p-0 text-xs text-red-500">
            {errors.avatar.message as string}
          </p>
        )}
        <AuthInput
          className="w-full"
          type="file"
          placeholder="Avatar"
          {...register("avatar")}
          error={Boolean(errors.avatar)}
        />
      </AuthFormGroup>
      {Boolean(avatar.length) && (
        <Image
          src={avatar}
          alt="123"
          className="h-24 w-24"
          width={24}
          height={24}
        />
      )}
      <AuthButton
        type="submit"
        className="mt-5 w-full text-center"
        isLoading={isLoading}
        variant="error"
      >
        Remove account
      </AuthButton>
    </form>
  );
}
