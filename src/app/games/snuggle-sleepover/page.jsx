
import { getBuddies } from "@/lib/storyblok";
import SleepoverGame from "./SleepoverGame";

export const metadata = {
  title: "The Snuggle Sleepover | Snuggle Buddies",
  description:
    "Choose your favourite Snuggle Buddy, make them cosy, and get them ready for bed.",
};

export default async function SnuggleSleepoverPage() {
  const buddies = await getBuddies();

  return <SleepoverGame buddies={buddies} />;
}