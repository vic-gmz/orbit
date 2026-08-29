export default function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name?: string | number; value?: number | string }>;
  label?: string | number;
}) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="rounded-xl border border-sand bg-paper px-3 py-2 text-xs shadow-lift">
      {label !== undefined && (
        <p className="font-semibold text-ink">{label}</p>
      )}
      {payload.map((p, i) => (
        <p key={i} className="text-muted">
          {p.name}:{" "}
          <span className="font-semibold text-ink">{p.value}</span>
        </p>
      ))}
    </div>
  );
}
