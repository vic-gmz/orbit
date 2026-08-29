import type { CSSProperties } from "react";
import { getAuraColor } from "../../lib/gamification";

export default function AuraAvatar({
  src,
  name,
  interactionCount,
  size = 40,
}: {
  src?: string | null;
  name: string;
  interactionCount: number;
  size?: number;
}) {
  const auraColor = getAuraColor(interactionCount);
  const svgSize = size + 8;
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg
        className="aura-glow absolute"
        style={
          {
            top: -4,
            left: -4,
            width: svgSize,
            height: svgSize,
            "--aura-color": auraColor,
          } as CSSProperties
        }
        viewBox={`0 0 ${svgSize} ${svgSize}`}
        aria-hidden="true"
      >
        <circle
          cx={svgSize / 2}
          cy={svgSize / 2}
          r={size / 2 + 1}
          fill="none"
          stroke={auraColor}
          strokeWidth={2}
        />
      </svg>
      {src ? (
        <img
          src={src}
          alt=""
          className="h-full w-full rounded-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded-full bg-sand/60 text-sm font-semibold text-ink-soft">
          {initials}
        </div>
      )}
    </div>
  );
}
