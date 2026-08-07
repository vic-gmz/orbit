import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function WeeklyGoalWidget() {
  const progress = useQuery(api.goals.weeklyProgress, {});

  if (progress === undefined) {
    return <p className="text-sm text-gray-500">Loading...</p>;
  }

  return (
    <GoalEditor key={progress.goal} goal={progress.goal} current={progress.current} />
  );
}

function GoalEditor({ goal, current }: { goal: number; current: number }) {
  const [draft, setDraft] = useState<number | "">(goal);
  const setWeeklyGoal = useMutation(api.goals.setWeeklyGoal);

  const pct =
    goal > 0 ? Math.min(100, Math.round((current / goal) * 100)) : 0;

  const handleSave = async () => {
    const value = Number(draft);
    if (!Number.isFinite(value) || value < 1) return;
    await setWeeklyGoal({ goal: value });
  };

  return (
    <section className="flex flex-col gap-2 rounded border p-4">
      <h2 className="font-medium">Weekly goal</h2>
      <div className="h-2 w-full overflow-hidden rounded bg-gray-200">
        <div className="h-full bg-blue-600" style={{ width: `${pct}%` }} />
      </div>
      <p className="text-sm text-gray-500">
        {current} of {goal} interactions this week
      </p>
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={1}
          value={draft}
          onChange={(e) =>
            setDraft(e.target.value === "" ? "" : Number(e.target.value))
          }
          className="w-20 rounded border px-2 py-1 text-sm"
        />
        <button
          type="button"
          onClick={handleSave}
          className="rounded border px-2 py-1 text-sm"
        >
          Set goal
        </button>
      </div>
    </section>
  );
}
