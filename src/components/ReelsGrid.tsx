"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Play, X } from "lucide-react";
import DownloadButton from "./DownloadButton";
import { formatDuration } from "@/lib/format";
import { useBodyScrollLock } from "@/lib/use-body-scroll-lock";
import type { Reel } from "@/types/instagram";

interface ReelsGridProps {
  reels: Reel[];
}

export default function ReelsGrid({ reels }: ReelsGridProps) {
  const [active, setActive] = useState<Reel | null>(null);
  useBodyScrollLock(active !== null);

  if (reels.length === 0) {
    return <p className="text-sm text-foreground/50">No reels found for this profile.</p>;
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {reels.map((reel) => (
          <button
            key={reel.id}
            onClick={() => setActive(reel)}
            className="group relative aspect-[9/16] overflow-hidden rounded-xl border border-border bg-surface-raised"
          >
            {reel.thumbnailUrl ? (
              <Image
                src={reel.thumbnailUrl}
                alt={reel.caption || `Reel from @${reel.username}`}
                fill
                sizes="220px"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                unoptimized
              />
            ) : null}
            <div className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 transition-opacity group-hover:opacity-100">
              <Play className="h-8 w-8 text-white drop-shadow" fill="white" />
            </div>
            {reel.durationSeconds ? (
              <span className="absolute bottom-1.5 right-1.5 rounded bg-black/70 px-1.5 py-0.5 text-[10px] font-medium text-white">
                {formatDuration(reel.durationSeconds)}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(event) => event.stopPropagation()}
              className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-surface"
            >
              <button
                onClick={() => setActive(null)}
                className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white"
                aria-label="Close preview"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="relative aspect-[9/16] w-full bg-black">
                <video
                  src={active.videoUrl}
                  poster={active.thumbnailUrl}
                  controls
                  autoPlay
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="space-y-3 p-4">
                {active.caption ? <p className="line-clamp-2 text-sm text-foreground/70">{active.caption}</p> : null}
                <DownloadButton
                  href={`/api/download?url=${encodeURIComponent(active.videoUrl)}&username=${encodeURIComponent(
                    active.username,
                  )}&type=video`}
                  className="w-full"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
