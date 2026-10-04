"use client";

import { useEffect, useRef } from "react";
import { ADSENSE_CLIENT_ID } from "@/lib/adsense";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

type DesktopAdSize = "leaderboard" | "mediumRectangle";

const DESKTOP_MAX_WIDTH: Record<DesktopAdSize, number> = {
  leaderboard: 728,
  mediumRectangle: 300,
};

interface AdSlotProps {
  id: string;
  /** Max width at sm breakpoint and above; the unit is responsive below that. */
  size?: DesktopAdSize;
  className?: string;
}

/**
 * Renders a real AdSense auto ad unit (data-ad-slot intentionally omitted —
 * Auto ads fills in-page placements like this one without a per-unit slot
 * ID). Each mounted instance pushes itself to the adsbygoogle queue once,
 * guarded by a ref so React Strict Mode's double-effect in dev doesn't
 * double-push the same <ins> element.
 */
export default function AdSlot({ id, size = "leaderboard", className = "" }: AdSlotProps) {
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // adsbygoogle.js may not have loaded yet (blocked, offline, etc.) — fail silently.
    }
  }, []);

  return (
    <div data-ad-placement={id} className={`mx-auto w-full ${className}`} style={{ maxWidth: DESKTOP_MAX_WIDTH[size] }}>
      <ins
        className="adsbygoogle"
        style={{ display: "block", minHeight: 50 }}
        data-ad-client={ADSENSE_CLIENT_ID}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
