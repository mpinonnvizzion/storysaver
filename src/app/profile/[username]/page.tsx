import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProfileHeader from "@/components/ProfileHeader";
import ProfileTabs from "@/components/ProfileTabs";
import { instagramService } from "@/lib/instagram";
import { InstagramServiceError } from "@/types/instagram";
import { buildMetadata } from "@/lib/metadata";

interface ProfilePageProps {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
  const { username } = await params;
  return buildMetadata({
    title: `Download @${username}'s Instagram Stories & Reels | StorySnag`,
    description: `Download Instagram stories, reels, and the HD profile picture for @${username} — free, anonymous, no login required.`,
    path: `/profile/${username}`,
  });
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;

  let profile;
  try {
    profile = await instagramService.getProfile(username);
  } catch (error) {
    if (error instanceof InstagramServiceError) {
      if (error.code === "NOT_FOUND") notFound();
      return <ProfileLoadError message={error.message} />;
    }
    throw error;
  }

  const [storiesResult, reelsResult] = await Promise.allSettled([
    instagramService.getStories(username),
    instagramService.getReels(username),
  ]);

  const stories = storiesResult.status === "fulfilled" ? storiesResult.value : [];
  const reels = reelsResult.status === "fulfilled" ? reelsResult.value : [];
  const loadError =
    storiesResult.status === "rejected" && reelsResult.status === "rejected"
      ? "Couldn't load stories or reels for this profile right now."
      : null;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:py-14">
      <ProfileHeader profile={profile} />

      {profile.isPrivate ? (
        <p className="mt-8 rounded-lg border border-border bg-surface-raised px-4 py-3 text-sm text-foreground/60">
          This account is private — only public content can be fetched.
        </p>
      ) : (
        <>
          <div className="mt-10">
            <ProfileTabs stories={stories} reels={reels} />
          </div>
          {loadError ? <p className="mt-6 text-sm text-red-300">{loadError}</p> : null}
        </>
      )}
    </div>
  );
}

function ProfileLoadError({ message }: { message: string }) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center px-4 py-24 text-center">
      <h1 className="font-display text-xl font-bold text-foreground">Couldn&apos;t load this profile</h1>
      <p className="mt-2 text-sm text-foreground/60">{message}</p>
    </div>
  );
}
