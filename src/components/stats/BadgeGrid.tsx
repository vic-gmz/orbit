import type { Achievement, AchievementType } from "../../types";
import { ACHIEVEMENTS } from "../../lib/gamification";

export default function BadgeGrid({
  achievements,
}: {
  achievements: Achievement[];
}) {
  const unlocked = new Set<AchievementType>(
    achievements.map((a) => a.type),
  );

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {ACHIEVEMENTS.map((def) => {
        const isUnlocked = unlocked.has(def.id);
        return (
          <div
            key={def.id}
            className={`card flex flex-col items-center gap-1.5 p-4 text-center transition-all duration-300 ${
              isUnlocked ? "" : "opacity-45 grayscale"
            }`}
          >
            <span
              className={`text-2xl ${isUnlocked ? "achievement-glow" : ""}`}
              aria-hidden="true"
            >
              {isUnlocked ? "🏅" : "?"}
            </span>
            <span className="text-sm font-semibold leading-tight text-ink">
              {def.name}
            </span>
            <span className="text-xs text-muted">
              {isUnlocked ? "Unlocked" : "Locked"}
            </span>
          </div>
        );
      })}
    </div>
  );
}
