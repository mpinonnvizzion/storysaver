import SkeletonLoader from "@/components/SkeletonLoader";

export default function DownloadLoading() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center px-4 py-14">
      <SkeletonLoader className="aspect-[9/16] w-full" />
      <div className="mt-4 flex w-full items-center justify-between gap-3">
        <SkeletonLoader className="h-4 w-24" />
        <SkeletonLoader className="h-9 w-24 rounded-full" />
      </div>
    </div>
  );
}
