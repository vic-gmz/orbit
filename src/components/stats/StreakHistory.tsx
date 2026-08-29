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
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <div className="rounded-2xl border border-sand bg-sand/30 p-4 text-center">
        <p className="text-sm text-muted">Current streak</p>
        <p className="font-display text-xl font-semibold text-ink">
          {current} días
        </p>
      </div>
      <div className="rounded-2xl border border-sand bg-sand/30 p-4 text-center">
        <p className="text-sm text-muted">Longest streak</p>
        <p className="font-display text-xl font-semibold text-ink">
          {longest} días
        </p>
      </div>
      <div className="rounded-2xl border border-sand bg-sand/30 p-4 text-center">
        <p className="text-sm text-muted">Best week</p>
        <p className="font-display text-xl font-semibold text-ink">
          {bestWeek} interactions
        </p>
      </div>
    </div>
  );
}
