import type { Metadata } from "next";
import ProfileClient from "./ProfileClient";
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

// Data fetching happens client-side in ProfileClient — Apify runs take
// 15-20s, well past Vercel Hobby's 10s serverless function limit, so this
// segment can't block on them during SSR.
export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params;
  return <ProfileClient key={username} username={username} />;
}
