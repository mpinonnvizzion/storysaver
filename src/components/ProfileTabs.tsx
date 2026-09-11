"use client";

import { useState } from "react";
import StoriesGrid from "./StoriesGrid";
import ReelsGrid from "./ReelsGrid";
import AdSlot from "./AdSlot";
import type { Reel, Story } from "@/types/instagram";

interface ProfileTabsProps {
  stories: Story[];
  reels: Reel[];
}

export default function ProfileTabs({ stories, reels }: ProfileTabsProps) {
  const [tab, setTab] = useState<"stories" | "reels">("stories");

  return (
    <div>
      <div className="flex gap-2 border-b border-border">
        <TabButton active={tab === "stories"} onClick={() => setTab("stories")} label={`Stories (${stories.length})`} />
        <TabButton active={tab === "reels"} onClick={() => setTab("reels")} label={`Reels (${reels.length})`} />
      </div>

      {/* Sits between the stories and reels views since the two share a tab slot. */}
      <div className="py-6">
        <AdSlot id="profile-between-stories-reels" size="mediumRectangle" />
      </div>

      <div>{tab === "stories" ? <StoriesGrid stories={stories} /> : <ReelsGrid reels={reels} />}</div>
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
