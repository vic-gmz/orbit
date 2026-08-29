import { useStreak } from "../../hooks/useStreak";

function streakLabel(current: number): string {
  if (current === 0) return "Start networking!";
  if (current >= 30) return `${current} días — Unstoppable!`;
  if (current >= 7) return `${current} días — Consistent`;
  return `${current} días`;
}

export default function StreakDisplay() {
  const { current, longest, loading } = useStreak();

  if (loading) {
    return (
      <section className="card p-5">
        <p className="text-sm text-muted">Loading…</p>
      </section>
    );
  }

  return (
    <section className="card flex flex-col gap-1.5 p-5">
      <h2 className="section-title">Streak</h2>
      <p className="flex items-baseline gap-2.5 text-3xl font-semibold text-ink">
        <span className="flame-flicker text-2xl" aria-hidden="true">
          🔥
        </span>
        {current}
        <span className="text-base font-normal text-muted">
          {current === 1 ? "day" : "days"}
        </span>
      </p>
      <p className="text-sm text-muted">{streakLabel(current)}</p>
      <p className="mt-1.5 w-fit rounded-full bg-sand/50 px-2.5 py-1 text-xs font-medium text-ink-soft">
        Longest: {longest}
      </p>
    </section>
  );
}
