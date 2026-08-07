import { Link } from "react-router-dom";

export default function EmptyState({
  title,
  message,
  actionLabel,
  actionTo,
}: {
  title: string;
  message?: string;
  actionLabel?: string;
  actionTo?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2 rounded border p-8 text-center">
      <p className="font-medium">{title}</p>
      {message && <p className="text-sm text-gray-500">{message}</p>}
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="rounded bg-black px-3 py-2 text-sm text-white"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
