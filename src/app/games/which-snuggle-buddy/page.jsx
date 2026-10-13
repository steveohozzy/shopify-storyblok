
import { getBuddies } from "@/lib/storyblok";
import BuddyQuiz from "./BuddyQuiz";

export const metadata = {
  title: "Which Snuggle Buddy Are You? | Snuggle Buddies",
  description:
    "Answer five fun personality questions and discover your perfect Snuggle Buddy.",
};

export default async function WhichSnuggleBuddyPage() {
  const buddies = await getBuddies();

  return <BuddyQuiz buddies={buddies || []} />;
}
