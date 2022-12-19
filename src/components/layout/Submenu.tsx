export const Submenu = () => {
  return (
    <div className="fixed bottom-0 flex w-screen items-center justify-center gap-4 pb-4">
      <div className="text-semibold flex items-center rounded-full bg-slate-300 bg-gradient-to-r  from-cyan-500 to-blue-500 p-4 text-white shadow-sm transition-all hover:shadow-lg ">
        Feed
      </div>
      <div className="text-semibold flex items-center rounded-full bg-slate-300 p-4 shadow-sm transition-all hover:shadow-lg ">
        Users
      </div>
      <div className="text-semibold flex items-center rounded-full bg-slate-300 p-4 shadow-sm transition-all hover:shadow-lg ">
        Groups
      </div>
      <div className="text-semibold flex items-center rounded-full bg-slate-300 p-4 shadow-sm transition-all hover:shadow-lg ">
        Events
      </div>
      <div className="text-semibold flex items-center rounded-full bg-slate-300 p-4 shadow-sm transition-all hover:shadow-lg ">
        Messages
      </div>
    </div>
  );
};
