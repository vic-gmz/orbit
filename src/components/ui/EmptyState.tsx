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
    <div className="card flex flex-col items-center gap-3 px-8 py-12 text-center">
      <div className="relative mb-1 flex h-20 w-20 items-center justify-center">
        <div
          className="orbit-ring h-20 w-20 opacity-80"
          aria-hidden="true"
        />
        <div
          className="h-4 w-4 rounded-full bg-gradient-to-br from-sun to-coral"
          style={{ boxShadow: "0 0 24px rgb(232 160 76 / 0.55)" }}
          aria-hidden="true"
        />
      </div>
      <p className="font-display text-lg font-semibold text-ink">{title}</p>
      {message && <p className="max-w-sm text-sm text-muted">{message}</p>}
      {actionLabel && actionTo && (
        <Link to={actionTo} className="btn btn-primary mt-1">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
