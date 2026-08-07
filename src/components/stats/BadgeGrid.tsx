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
    <div className="grid grid-cols-3 gap-2">
      {ACHIEVEMENTS.map((def) => {
        const isUnlocked = unlocked.has(def.id);
        return (
          <div
            key={def.id}
            className={`flex flex-col items-center gap-1 rounded border p-3 ${
              isUnlocked ? "" : "opacity-50 grayscale"
            }`}
          >
            <span className="text-xl">{isUnlocked ? "🏅" : "?"}</span>
            <span className="text-sm font-medium">{def.name}</span>
            <span className="text-xs text-gray-500">
              {isUnlocked ? "Unlocked" : "Locked"}
            </span>
          </div>
        );
      })}
    </div>
  );
}
