"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import { parseSmartInput, stripDisplayPrefix } from "@/lib/input-parser";

export default function SmartInputBar() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading) return;

    const trimmed = value.trim();
    const parsed = parseSmartInput(trimmed);
    setError(null);

    if (parsed.kind === "invalid") {
      setError(parsed.reason);
      return;
    }

    setLoading(true);

    if (parsed.kind === "handle") {
      router.push(`/profile/${encodeURIComponent(parsed.username)}`);
      return;
    }

    // story / reel / post: resolve on the dedicated direct-link results page.
    router.push(`/download?url=${encodeURIComponent(trimmed)}`);
  }

  return (
    <div className="w-full max-w-xl">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1 rounded-2xl border border-border bg-surface transition-shadow focus-within:accent-glow">
          <input
            type="text"
            inputMode="text"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onBlur={() => setValue((current) => stripDisplayPrefix(current))}
            placeholder="username, @handle, or instagram.com/..."
            className="h-14 w-full rounded-2xl bg-transparent px-5 text-base text-foreground placeholder:text-foreground/40 focus:outline-none"
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          disabled={loading || !value.trim()}
          className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-accent-500 px-6 font-display font-semibold text-stone-950 transition-colors hover:bg-accent-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" strokeWidth={2.5} />}
          <span className="sm:hidden">{loading ? "Fetching…" : "Snag it"}</span>
        </button>
      </form>

      <p className="mt-2 px-1 text-sm text-foreground/50">Enter a username, @handle, or Instagram link</p>

      <AnimatePresence mode="wait">
        {error && (
          <motion.p
            key="error"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="mt-3 rounded-lg border border-red-900/60 bg-red-950/30 px-4 py-2.5 text-sm text-red-300"
            role="alert"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
