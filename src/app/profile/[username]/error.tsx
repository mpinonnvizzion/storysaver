"use client";

export default function ProfileError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center px-4 py-24 text-center">
      <h1 className="font-display text-xl font-bold text-foreground">Something went wrong</h1>
      <p className="mt-2 text-sm text-foreground/60">Couldn&apos;t load this profile. Please try again.</p>
      <button
        onClick={reset}
        className="mt-6 rounded-full bg-accent-500 px-5 py-2.5 text-sm font-semibold text-stone-950 transition-colors hover:bg-accent-400"
      >
        Try again
      </button>
    </div>
  );
}
