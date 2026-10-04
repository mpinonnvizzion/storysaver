"use client";

import { useState } from "react";
import StoriesGrid from "./StoriesGrid";
import ReelsGrid from "./ReelsGrid";
import HighlightsGrid from "./HighlightsGrid";
import AdSlot from "./AdSlot";
import type { Highlight, Reel, Story } from "@/types/instagram";

interface ProfileTabsProps {
  stories: Story[];
  reels: Reel[];
  highlights: Highlight[];
}

export default function ProfileTabs({ stories, reels, highlights }: ProfileTabsProps) {
  const [tab, setTab] = useState<"stories" | "reels" | "highlights">("stories");

  return (
    <div>
      <div className="flex gap-2 border-b border-border">
        <TabButton active={tab === "stories"} onClick={() => setTab("stories")} label={`Stories (${stories.length})`} />
        <TabButton active={tab === "reels"} onClick={() => setTab("reels")} label={`Reels (${reels.length})`} />
        <TabButton
          active={tab === "highlights"}
          onClick={() => setTab("highlights")}
          label={`Highlights (${highlights.length})`}
        />
      </div>

      {/* Sits between the tab bar and whichever grid is active. */}
      <div className="py-6">
        <AdSlot id="profile-between-stories-reels" size="mediumRectangle" />
      </div>

      <div>
        {tab === "stories" && <StoriesGrid stories={stories} />}
        {tab === "reels" && <ReelsGrid reels={reels} />}
        {tab === "highlights" && <HighlightsGrid highlights={highlights} />}
      </div>
    </div>
  );
}

function TabButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex min-h-11 items-center px-4 text-sm font-medium transition-colors ${
        active ? "border-b-2 border-accent-400 text-foreground" : "text-foreground/50 hover:text-foreground/80"
      }`}
    >
      {label}
    </button>
  );
}
