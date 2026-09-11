import SkeletonLoader from "@/components/SkeletonLoader";

export default function ProfileLoading() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:py-14">
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <SkeletonLoader className="h-28 w-28 shrink-0 rounded-full sm:h-32 sm:w-32" />
        <div className="w-full flex-1 space-y-3">
          <SkeletonLoader className="h-7 w-48" />
          <SkeletonLoader className="h-4 w-32" />
          <SkeletonLoader className="h-4 w-64" />
        </div>
      </div>
      <div className="mt-10 grid grid-cols-3 gap-3 sm:grid-cols-5">
        {Array.from({ length: 10 }).map((_, index) => (
          <SkeletonLoader key={index} className="aspect-[9/16]" />
        ))}
      </div>
    </div>
  );
}
