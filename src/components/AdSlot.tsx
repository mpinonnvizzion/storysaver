type DesktopAdSize = "leaderboard" | "mediumRectangle";

const DESKTOP_DIMENSIONS: Record<DesktopAdSize, { width: number; height: number; label: string }> = {
  leaderboard: { width: 728, height: 90, label: "728 × 90" },
  mediumRectangle: { width: 300, height: 250, label: "300 × 250" },
};

const MOBILE_DIMENSIONS = { width: 320, height: 50, label: "320 × 50" };

interface AdSlotProps {
  id: string;
  /** Size shown at sm breakpoint and above. Mobile always gets the 320×50 banner. */
  size?: DesktopAdSize;
  className?: string;
}

/**
 * Reserves ad layout space so nothing shifts once a network (AdSense, etc.)
 * is wired in via this element's data-ad-slot id. Intentionally empty for
 * now — no interstitials, no fake download buttons, ever.
 */
export default function AdSlot({ id, size = "leaderboard", className = "" }: AdSlotProps) {
  const desktop = DESKTOP_DIMENSIONS[size];

  return (
    <div data-ad-slot={id} className={`flex w-full justify-center ${className}`}>
      <div
        className="hidden w-full items-center justify-center rounded-lg border border-dashed border-border/60 bg-surface-raised/40 text-xs text-foreground/30 sm:flex"
        style={{ maxWidth: desktop.width, height: desktop.height }}
        aria-hidden="true"
      >
        Ad {desktop.label}
      </div>
      <div
        className="flex w-full items-center justify-center rounded-lg border border-dashed border-border/60 bg-surface-raised/40 text-xs text-foreground/30 sm:hidden"
        style={{ maxWidth: MOBILE_DIMENSIONS.width, height: MOBILE_DIMENSIONS.height }}
        aria-hidden="true"
      >
        Ad {MOBILE_DIMENSIONS.label}
      </div>
    </div>
  );
}
