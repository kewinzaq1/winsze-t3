import { UserSkeleton } from "./UserSkeleton";

export const UserSkeletons = ({ length }: { length?: number }) => {
  const arr = new Array(length || 6).fill(0);

  return (
    <>
      {arr.map((_, index) => (
        <UserSkeleton key={index} />
      ))}
    </>
  );
};
