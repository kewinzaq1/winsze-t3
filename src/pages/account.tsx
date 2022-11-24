import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { trpc } from "src/utils/trpc";
import { z } from "zod";

export default function AccountPage() {
  const { mutate, isLoading, error } =
    trpc.account.changePassword.useMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(
      z.object({ currentPassword: z.string(), newPassword: z.string() })
    ),
  });

  const onSubmit = (value: any) => {
    console.log(value);
    mutate(value);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        {error && <p>{error.message}</p>}
        {isLoading && <p>Loading...</p>}
        <input
          type="password"
          placeholder="Current password"
          {...register("currentPassword")}
        />
        <input
          type="password"
          placeholder="New Password"
          {...register("newPassword")}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
