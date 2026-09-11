import Image from "next/image";
import { BadgeCheck, Lock } from "lucide-react";
import DownloadButton from "./DownloadButton";
import { formatCount } from "@/lib/format";
import type { Profile } from "@/types/instagram";

interface ProfileHeaderProps {
  profile: Profile;
}

export default function ProfileHeader({ profile }: ProfileHeaderProps) {
  const downloadHref = `/api/download?url=${encodeURIComponent(profile.profilePicHdUrl)}&username=${encodeURIComponent(
    profile.username,
  )}&type=profile`;

  return (
    <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:text-left">
      <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full border-2 border-border bg-surface-raised sm:h-32 sm:w-32">
        {profile.profilePicUrl ? (
          <Image
            src={profile.profilePicUrl}
            alt={`${profile.username}'s profile picture`}
            fill
            sizes="128px"
            className="object-cover"
            unoptimized
          />
        ) : null}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-center gap-2 sm:justify-start">
          <h1 className="font-display text-2xl font-bold text-foreground">{profile.fullName || profile.username}</h1>
          {profile.isVerified && <BadgeCheck className="h-5 w-5 shrink-0 text-accent-400" aria-label="Verified" />}
          {profile.isPrivate && <Lock className="h-4 w-4 shrink-0 text-foreground/40" aria-label="Private account" />}
        </div>
        <p className="text-foreground/60">@{profile.username}</p>
        {profile.bio ? <p className="mt-2 max-w-md text-sm text-foreground/70">{profile.bio}</p> : null}
        <div className="mt-3 flex justify-center gap-4 text-sm text-foreground/60 sm:justify-start">
          <span>
            <strong className="text-foreground">{formatCount(profile.followerCount)}</strong> followers
          </span>
          <span>
            <strong className="text-foreground">{formatCount(profile.postCount)}</strong> posts
          </span>
        </div>
        <div className="mt-4 flex justify-center sm:justify-start">
          <DownloadButton href={downloadHref} label="Download HD profile pic" size="sm" />
        </div>
      </div>
    </div>
  );
}
