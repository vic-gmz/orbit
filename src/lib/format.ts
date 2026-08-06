const DAY = 86400000;

export function formatRelativeDate(ts?: number): string {
  if (!ts) return "Never";
  const diff = Date.now() - ts;
  if (diff < DAY) return "Today";
  if (diff < 7 * DAY) return `${Math.floor(diff / DAY)}d ago`;
  return new Date(ts).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
