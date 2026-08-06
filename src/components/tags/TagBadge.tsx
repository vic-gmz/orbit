import type { Tag } from "../../types";

export default function TagBadge({
  tag,
  active,
  onClick,
}: {
  tag: Tag;
  active?: boolean;
  onClick?: () => void;
}) {
  const style = active
    ? { backgroundColor: tag.color, color: "#fff" }
    : { backgroundColor: `${tag.color}33`, color: tag.color };

  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full px-2 py-1 text-xs"
      style={style}
    >
      {tag.name}
    </button>
  );
}
