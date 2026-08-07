import type { AchievementType } from "../types";

export const ACHIEVEMENTS: {
  id: AchievementType;
  name: string;
  toast: string;
}[] = [
  {
    id: "first_contact",
    name: "First Contact",
    toast: "👋 First Contact — you reached out!",
  },
  {
    id: "networker",
    name: "Networker",
    toast: "🤝 Networker — 5 interactions logged!",
  },
  {
    id: "consistent",
    name: "Consistent",
    toast: "🔥 Consistent — 7 day streak!",
  },
  {
    id: "bridge_builder",
    name: "Bridge Builder",
    toast: "🌉 Bridge Builder — 5 contacts at one company!",
  },
  {
    id: "follow_up_champ",
    name: "Follow-up Champ",
    toast: "📬 Follow-up Champ — 10 follow-ups done!",
  },
  {
    id: "orbit_master",
    name: "Orbit Master",
    toast: "🌌 Orbit Master — 50 interactions!",
  },
];

export function getLevel(totalInteractions: number): {
  level: number;
  title: string;
  emoji: string;
} {
  if (totalInteractions >= 250) return { level: 6, title: "Diamond", emoji: "👑" };
  if (totalInteractions >= 100) return { level: 5, title: "Platinum", emoji: "💎" };
  if (totalInteractions >= 50) return { level: 4, title: "Gold", emoji: "🥇" };
  if (totalInteractions >= 25) return { level: 3, title: "Silver", emoji: "🥈" };
  if (totalInteractions >= 5) return { level: 2, title: "Bronze", emoji: "🥉" };
  return { level: 1, title: "Rookie", emoji: "🌱" };
}
