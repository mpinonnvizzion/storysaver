"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import DownloadButton from "./DownloadButton";
import { useBodyScrollLock } from "@/lib/use-body-scroll-lock";
import type { Story } from "@/types/instagram";

interface StoriesGridProps {
  stories: Story[];
}

export default function StoriesGrid({ stories }: StoriesGridProps) {
  const [active, setActive] = useState<Story | null>(null);
  useBodyScrollLock(active !== null);

  if (stories.length === 0) {
    return <p className="text-sm text-foreground/50">No active stories right now.</p>;
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {stories.map((story) => (
          <button
            key={story.id}
            onClick={() => setActive(story)}
            className="group relative aspect-[9/16] overflow-hidden rounded-xl border border-border bg-surface-raised"
          >
            {story.thumbnailUrl ? (
              <Image
                src={story.thumbnailUrl}
                alt={`Story from @${story.username}`}
                fill
                sizes="200px"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                unoptimized
              />
            ) : null}
            {story.type === "video" && (
              <span className="absolute right-1.5 top-1.5 rounded bg-black/60 px-1 py-0.5 text-[10px] font-medium tracking-wide text-white">
                VIDEO
              </span>
            )}
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
                {active.type === "video" ? (
                  <video
                    src={active.mediaUrl}
                    poster={active.thumbnailUrl}
                    controls
                    autoPlay
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <Image
                    src={active.mediaUrl}
                    alt={`Story from @${active.username}`}
                    fill
                    sizes="384px"
                    className="object-contain"
                    unoptimized
                  />
                )}
              </div>
              <div className="p-4">
                <DownloadButton
                  href={`/api/download?url=${encodeURIComponent(active.mediaUrl)}&username=${encodeURIComponent(
                    active.username,
                  )}&type=${active.type === "video" ? "video" : "photo"}`}
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
