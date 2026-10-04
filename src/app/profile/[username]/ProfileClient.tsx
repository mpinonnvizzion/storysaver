"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import ProfileHeader from "@/components/ProfileHeader";
import ProfileTabs from "@/components/ProfileTabs";
import SkeletonLoader from "@/components/SkeletonLoader";
import type { Profile, Reel, Story } from "@/types/instagram";

type Status = "loading" | "ready" | "not_found" | "error";

interface ProfileClientProps {
  username: string;
}

async function fetchJson<T>(url: string): Promise<{ ok: boolean; data: T }> {
  const res = await fetch(url);
  const data = (await res.json()) as T;
  return { ok: res.ok, data };
}

export default function ProfileClient({ username }: ProfileClientProps) {
  const [status, setStatus] = useState<Status>("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [tabsLoading, setTabsLoading] = useState(true);
  const [stories, setStories] = useState<Story[]>([]);
  const [reels, setReels] = useState<Reel[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      let fetchedProfile: Profile;
      try {
        const res = await fetch(`/api/profile?username=${encodeURIComponent(username)}`);
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          if (data.code === "NOT_FOUND") {
            setStatus("not_found");
          } else {
            setErrorMessage(data.error ?? "Couldn't load this profile");
            setStatus("error");
          }
          return;
        }
        fetchedProfile = data as Profile;
      } catch {
        if (!cancelled) {
          setErrorMessage("Couldn't load this profile");
          setStatus("error");
        }
        return;
      }

      if (cancelled) return;
      // Reveal the header immediately; stories/reels fill in underneath once they settle.
      setProfile(fetchedProfile);
      setStatus("ready");

      // Private accounts can't have public stories/reels — skip the (guaranteed
      // to fail) Apify runs entirely rather than waiting ~15-20s for nothing.
      if (fetchedProfile.isPrivate) {
        setTabsLoading(false);
        return;
      }

      const [storiesResult, reelsResult] = await Promise.allSettled([
        fetchJson<{ stories: Story[] }>(`/api/stories?username=${encodeURIComponent(username)}`),
        fetchJson<{ reels: Reel[] }>(`/api/reels?username=${encodeURIComponent(username)}`),
      ]);
      if (cancelled) return;

      const storiesOk = storiesResult.status === "fulfilled" && storiesResult.value.ok;
      const reelsOk = reelsResult.status === "fulfilled" && reelsResult.value.ok;

      setStories(storiesOk && storiesResult.status === "fulfilled" ? storiesResult.value.data.stories ?? [] : []);
      setReels(reelsOk && reelsResult.status === "fulfilled" ? reelsResult.value.data.reels ?? [] : []);
      setTabsLoading(false);
      if (!storiesOk && !reelsOk) {
        setLoadError("Couldn't load stories or reels for this profile right now.");
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [username]);

  if (status === "not_found") {
    notFound();
  }

  if (status === "loading") {
    return <ProfileLoadingShell />;
  }

  if (status === "error") {
    return <ProfileLoadError message={errorMessage} />;
  }

  if (!profile) return null;

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
            {tabsLoading ? (
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
                {Array.from({ length: 10 }).map((_, index) => (
                  <SkeletonLoader key={index} className="aspect-[9/16]" />
                ))}
              </div>
            ) : (
              <ProfileTabs stories={stories} reels={reels} />
            )}
          </div>
          {loadError ? <p className="mt-6 text-sm text-red-300">{loadError}</p> : null}
        </>
      )}
    </div>
  );
}

function ProfileLoadingShell() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:py-14">
      <p className="mb-6 text-center text-sm text-foreground/50 sm:text-left">
        Fetching Instagram data — this can take up to 20 seconds…
      </p>
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <SkeletonLoader className="h-28 w-28 shrink-0 rounded-full sm:h-32 sm:w-32" />
        <div className="w-full flex-1 space-y-3">
          <SkeletonLoader className="h-7 w-48" />
          <SkeletonLoader className="h-4 w-32" />
          <SkeletonLoader className="h-4 w-64" />
        </div>
      </div>
      <div className="mt-10 grid grid-cols-3 gap-3 sm:grid-cols-5">
        {Array.from({ length: 10 }).map((_, index) => (
          <SkeletonLoader key={index} className="aspect-[9/16]" />
        ))}
      </div>
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
