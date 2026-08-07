import { useStreak } from "../../hooks/useStreak";

function streakLabel(current: number): string {
  if (current === 0) return "Start networking!";
  if (current >= 30) return `${current} días — Unstoppable!`;
  if (current >= 7) return `${current} días — Consistent`;
  return `${current} días`;
}

export default function StreakDisplay() {
  const { current, longest, loading } = useStreak();

  if (loading) return <p className="text-sm text-gray-500">Loading...</p>;

  return (
    <section className="flex flex-col gap-1 rounded border p-4">
      <h2 className="font-medium">Streak</h2>
      <p className="text-2xl">🔥 {current}</p>
      <p className="text-sm text-gray-500">{streakLabel(current)}</p>
      <p className="text-sm text-gray-500">Longest: {longest}</p>
    </section>
  );
}
