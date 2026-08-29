import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function WeeklyGoalWidget() {
  const progress = useQuery(api.goals.weeklyProgress, {});

  if (progress === undefined) {
    return (
      <section className="card p-5">
        <p className="text-sm text-muted">Loading…</p>
      </section>
    );
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
    <section className="card flex flex-col gap-3 p-5">
      <div className="flex items-center justify-between">
        <h2 className="section-title">Weekly goal</h2>
        <span className="chip bg-sun-soft/60 text-ink-soft">{pct}%</span>
      </div>
      <div
        className="h-2.5 w-full overflow-hidden rounded-full bg-sand/70"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="progress-fill h-full rounded-full bg-gradient-to-r from-sun to-coral"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-sm text-muted">
        {current} of {goal} interactions this week
      </p>
      <div className="flex items-center gap-2">
        <label className="sr-only" htmlFor="weekly-goal">
          Weekly goal
        </label>
        <input
          id="weekly-goal"
          type="number"
          min={1}
          value={draft}
          onChange={(e) =>
            setDraft(e.target.value === "" ? "" : Number(e.target.value))
          }
          className="input w-20"
        />
        <button
          type="button"
          onClick={handleSave}
          className="btn btn-ghost btn-sm"
        >
          Set goal
        </button>
      </div>
    </section>
  );
}
