import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { AchievementType } from "../types";

export function useAchievements() {
  const achievements = useQuery(api.achievements.list, {});
  const unlockedTypes = new Set<AchievementType>(
    (achievements ?? []).map((a) => a.type),
  );
  return { achievements, unlockedTypes, loading: achievements === undefined };
}
