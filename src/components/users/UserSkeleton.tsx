export const UserSkeleton = () => (
  <div
    className="flex gap-4 rounded-md border-2 border-transparent border-b-slate-400 border-opacity-10 bg-white p-4
          shadow-md transition-all hover:border-opacity-100
      "
  >
    <div className="h-12 w-12 rounded-full bg-gray-300 p-2" />
    <div className="flex w-full items-center justify-between">
      <div className="col flex flex-col gap-1">
        <div className="mt-2 h-4 w-20 rounded-full bg-gray-300" />
        <div className="mt-2 h-4 w-56 rounded-full bg-gray-300" />
      </div>
      <p className="h-4 w-12 rounded-full bg-gray-300 p-2 px-2 py-1 text-sm lowercase"></p>
    </div>
  </div>
);
