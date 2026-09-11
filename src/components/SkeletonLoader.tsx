interface SkeletonLoaderProps {
  className?: string;
}

export default function SkeletonLoader({ className = "" }: SkeletonLoaderProps) {
  return <div className={`skeleton rounded-xl ${className}`} aria-hidden="true" />;
}
