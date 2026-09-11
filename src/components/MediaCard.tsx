"use client";

import Image from "next/image";
import { Play } from "lucide-react";
import DownloadButton from "./DownloadButton";
import { formatDuration } from "@/lib/format";
import type { Media } from "@/types/instagram";

interface MediaCardProps {
  media: Media;
}

export default function MediaCard({ media }: MediaCardProps) {
  const downloadHref = `/api/download?url=${encodeURIComponent(media.mediaUrl)}&username=${encodeURIComponent(
    media.username || "user",
  )}&type=${media.type === "video" ? "video" : "photo"}`;

  return (
    <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-border bg-surface shadow-xl shadow-black/20">
      <div className="relative aspect-[9/16] w-full bg-surface-raised">
        {media.thumbnailUrl ? (
          <Image
            src={media.thumbnailUrl}
            alt={media.caption || `${media.sourceKind} from @${media.username || "instagram"}`}
            fill
            sizes="384px"
            className="object-cover"
            unoptimized
          />
        ) : null}
        {media.type === "video" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black/50 backdrop-blur">
              <Play className="h-6 w-6 text-white" fill="white" />
            </span>
          </div>
        )}
        {media.durationSeconds ? (
          <span className="absolute bottom-2 right-2 rounded-md bg-black/70 px-1.5 py-0.5 text-xs font-medium text-white">
            {formatDuration(media.durationSeconds)}
          </span>
        ) : null}
      </div>
      <div className="flex items-center justify-between gap-3 p-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">@{media.username || "unknown"}</p>
          <p className="text-xs uppercase tracking-wide text-foreground/50">{media.sourceKind}</p>
        </div>
        <DownloadButton href={downloadHref} size="sm" />
      </div>
    </div>
  );
}
