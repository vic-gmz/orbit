import type { Goal, WeeklyCount } from "../../types";

export default function StreakHistory({
  goal,
  weekly,
}: {
  goal: Goal | null;
  weekly: WeeklyCount[];
}) {
  const current = goal?.currentStreak ?? 0;
  const longest = goal?.longestStreak ?? 0;
  const bestWeek = weekly.reduce((max, w) => Math.max(max, w.count), 0);

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="rounded border p-3 text-center">
        <p className="text-sm text-gray-500">Current streak</p>
        <p className="text-lg">{current} días</p>
      </div>
      <div className="rounded border p-3 text-center">
        <p className="text-sm text-gray-500">Longest streak</p>
        <p className="text-lg">{longest} días</p>
      </div>
      <div className="rounded border p-3 text-center">
        <p className="text-sm text-gray-500">Best week</p>
        <p className="text-lg">{bestWeek} interactions</p>
      </div>
    </div>
  );
}
