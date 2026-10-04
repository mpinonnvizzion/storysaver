"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import DownloadButton from "./DownloadButton";
import AdSlot from "./AdSlot";
import { useBodyScrollLock } from "@/lib/use-body-scroll-lock";
import type { Highlight, Story } from "@/types/instagram";

interface HighlightsGridProps {
  highlights: Highlight[];
}

export default function HighlightsGrid({ highlights }: HighlightsGridProps) {
  const [selected, setSelected] = useState<Highlight | null>(null);
  const [active, setActive] = useState<Story | null>(null);
  useBodyScrollLock(active !== null);

  if (highlights.length === 0) {
    return <p className="text-sm text-foreground/50">No highlights on this profile.</p>;
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {highlights.map((highlight) => (
          <button
            key={highlight.highlightId}
            onClick={() => setSelected(highlight)}
            className={`group relative flex aspect-[9/16] flex-col overflow-hidden rounded-xl border bg-surface-raised transition-colors ${
              selected?.highlightId === highlight.highlightId ? "border-accent-400" : "border-border"
            }`}
          >
            <div className="relative flex-1">
              {highlight.coverImageUrl ? (
                <Image
                  src={highlight.coverImageUrl}
                  alt={highlight.title || "Highlight cover"}
                  fill
                  sizes="200px"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  unoptimized
                />
              ) : null}
              <span className="absolute right-1.5 top-1.5 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium tracking-wide text-white">
                {highlight.mediaCount} {highlight.mediaCount === 1 ? "item" : "items"}
              </span>
            </div>
            <div className="truncate bg-surface px-2 py-1.5 text-left text-xs font-medium text-foreground">
              {highlight.title || "Highlight"}
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <>
          <div className="py-6">
            <AdSlot id="profile-highlight-expanded" size="mediumRectangle" />
          </div>

          <div>
            <h3 className="mb-3 font-display text-sm font-semibold text-foreground">
              {selected.title || "Highlight"}
            </h3>
            {selected.items.length === 0 ? (
              <p className="text-sm text-foreground/50">This highlight has no items to show.</p>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {selected.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActive(item)}
                    className="group relative aspect-[9/16] overflow-hidden rounded-xl border border-border bg-surface-raised"
                  >
                    {item.thumbnailUrl ? (
                      <Image
                        src={item.thumbnailUrl}
                        alt={`Highlight item from @${item.username}`}
                        fill
                        sizes="200px"
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        unoptimized
                      />
                    ) : null}
                    {item.type === "video" && (
                      <span className="absolute right-1.5 top-1.5 rounded bg-black/60 px-1 py-0.5 text-[10px] font-medium tracking-wide text-white">
                        VIDEO
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      )}

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
                    alt={`Highlight item from @${active.username}`}
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
