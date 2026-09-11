"use client";

import { Download } from "lucide-react";
import { motion } from "framer-motion";

interface DownloadButtonProps {
  href: string;
  label?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

// min-h-11 (44px) keeps every size a compliant thumb-friendly tap target,
// even where padding alone would land a few px short.
const SIZE_CLASSES: Record<NonNullable<DownloadButtonProps["size"]>, string> = {
  sm: "min-h-11 px-4 py-2 text-xs gap-1.5",
  md: "min-h-11 px-5 py-3 text-sm gap-2",
  lg: "min-h-12 px-7 py-4 text-base gap-2.5",
};

export default function DownloadButton({ href, label = "Download", size = "md", className = "" }: DownloadButtonProps) {
  return (
    <motion.a
      href={href}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={`inline-flex items-center justify-center rounded-full bg-accent-500 font-semibold text-stone-950 shadow-lg shadow-accent-900/30 transition-colors hover:bg-accent-400 ${SIZE_CLASSES[size]} ${className}`}
    >
      <Download className="h-4 w-4" strokeWidth={2.5} />
      {label}
    </motion.a>
  );
}
