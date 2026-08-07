import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export function useStreak() {
  const goal = useQuery(api.goals.get, {});
  return {
    goal,
    current: goal?.currentStreak ?? 0,
    longest: goal?.longestStreak ?? 0,
    loading: goal === undefined,
  };
}
