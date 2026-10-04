"use client";

import { useEffect, useState } from "react";
import MediaCard from "@/components/MediaCard";
import AdSlot from "@/components/AdSlot";
import SkeletonLoader from "@/components/SkeletonLoader";
import type { Media } from "@/types/instagram";

type Status = "loading" | "ready" | "error";

interface DownloadClientProps {
  url: string;
}

export default function DownloadClient({ url }: DownloadClientProps) {
  const [status, setStatus] = useState<Status>("loading");
  const [media, setMedia] = useState<Media | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    fetch(`/api/media?url=${encodeURIComponent(url)}`)
      .then(async (res) => {
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setErrorMessage(data.error ?? "Couldn't fetch that link");
          setStatus("error");
          return;
        }
        setMedia(data as Media);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) {
          setErrorMessage("Couldn't fetch that link");
          setStatus("error");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [url]);

  if (status === "loading") {
    return (
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center px-4 py-14">
        <p className="mb-4 text-center text-sm text-foreground/50">
          Fetching Instagram data — this can take up to 20 seconds…
        </p>
        <SkeletonLoader className="aspect-[9/16] w-full" />
        <div className="mt-4 flex w-full items-center justify-between gap-3">
          <SkeletonLoader className="h-4 w-24" />
          <SkeletonLoader className="h-9 w-24 rounded-full" />
        </div>
      </div>
    );
  }

  if (status === "error") {
    return <DownloadMessage title="Couldn't fetch that link" message={errorMessage} />;
  }

  if (!media) return null;

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center px-4 py-14">
      <MediaCard media={media} />
      <div className="mt-10 w-full">
        <AdSlot id="download-below-card" size="mediumRectangle" />
      </div>
    </div>
  );
}

function DownloadMessage({ title, message }: { title: string; message: string }) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center px-4 py-24 text-center">
      <h1 className="font-display text-xl font-bold text-foreground">{title}</h1>
      <p className="mt-2 text-sm text-foreground/60">{message}</p>
    </div>
  );
}
