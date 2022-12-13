import avatarPlaceholder from "src/images/avatar_placeholder.png";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "src/components/common/Button";
import { FormGroup } from "src/components/common/FormGroup";
import { Input } from "src/components/common/Input";
import { trpc } from "src/utils/trpc";
import { z } from "zod";
import { imgToBase64 } from "src/utils/imgToBase64";
import { ErrorMessage } from "../common/ErrorMessage";

export function AccountUpdateAvatar() {
  const { mutate, isLoading, error, data } =
    trpc.account.updateAvatar.useMutation();
  const {
    mutate: removeAvatar,
    isLoading: isRemovingAvatar,
    error: removeAvatarError,
    data: removeAvatarData,
  } = trpc.account.removeAvatar.useMutation({
    onSuccess: () => {
      setAvatar("");
      resetField("image");
    },
  });
  const session = useSession();
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    if (!avatar.length && session.data?.user?.image) {
      setAvatar(session.data.user?.image);
    }
  }, [avatar, avatar.length, session]);

  useEffect(() => {
    if (data) {
      setAvatar(data.image as string);
    }
  }, [data]);

  useEffect(() => {
    if (removeAvatarData) {
      setAvatar(""); // set avatar to empty string instead of removeAvatarData.image because it's null
    }
  }, [removeAvatarData]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    resetField,
  } = useForm({
    resolver: zodResolver(
      z.object({
        avatar:
          typeof window !== "undefined"
            ? z
                .instanceof(FileList, "File is required")
                .refine((val) => val.length > 0, "File is required")
            : z.any(),
      })
    ),
  });

  useEffect(() => {
    const subscription = watch((value) => {
      if (!value.avatar[0]) {
        return;
      }
      const url = URL.createObjectURL(value.avatar[0]);
      setAvatar(url);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const onSubmit = handleSubmit(async (value) => {
    if (!value.avatar[0]) {
      throw new Error("No file selected");
    }

    const { avatar } = value;

    const base64 = await imgToBase64(avatar[0]);

    mutate({ avatar: base64 });
  });

  return (
    <form onSubmit={onSubmit} className="relative">
      <p className="text-2xl font-semibold">Avatar</p>
      {(errors.avatar || removeAvatarError || error) && (
        <ErrorMessage>{`${
          errors.avatar?.message || removeAvatarError?.message || error?.message
        }`}</ErrorMessage>
      )}
      <div className="w-full items-center justify-between">
        <FormGroup className="flex w-full items-center justify-center">
          <label htmlFor="avatar">
            <div className="relative h-24 w-24 rounded-full">
              {avatar.length ? (
                <Image
                  src={avatar}
                  alt="123"
                  width={96}
                  height={96}
                  className="cover rounded-full"
                />
              ) : (
                <Image
                  src={avatarPlaceholder}
                  placeholder="blur"
                  alt="123"
                  width={96}
                  height={96}
                  className="cover rounded-full"
                />
              )}
            </div>
          </label>
          <Input
            id="avatar"
            className="hidden w-full"
            type="file"
            placeholder="Avatar"
            accept="image/png, image/jpeg"
            {...register("avatar")}
            error={Boolean(errors.avatar)}
          />
        </FormGroup>
        <div className="flex flex-col gap-2">
          <Button
            type="submit"
            className="mt-5 justify-center"
            isLoading={isLoading}
          >
            {isLoading ? "" : "Update"}
          </Button>
          <Button
            className="justify-center"
            disabled={!avatar.length}
            type="button"
            onClick={() => removeAvatar()}
            isLoading={isRemovingAvatar}
            variant="error"
          >
            {isRemovingAvatar ? "" : "Remove"}
          </Button>
        </div>
      </div>
    </form>
  );
}
