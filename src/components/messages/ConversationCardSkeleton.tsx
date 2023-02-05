export function ConversationCardSkeleton() {
  return (
    <div className="flex items-center gap-2 rounded-md bg-slate-50 p-4 shadow-sm">
      <div className="h-12 w-12 rounded-full bg-slate-200"></div>
      <div className="flex flex-col gap-1 truncate">
        <div className="h-4 w-24 bg-slate-200"></div>
        <div className="h-4 w-32 bg-slate-200"></div>
      </div>
    </div>
  );
}
