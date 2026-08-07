import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { WeeklyCount } from "../../types";

export default function WeeklyChart({ data }: { data: WeeklyCount[] }) {
  const points = data.map((w) => ({
    label: new Date(w.weekStart).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    }),
    count: w.count,
  }));

  if (points.every((p) => p.count === 0)) {
    return <p className="text-sm text-gray-500">No data yet</p>;
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={points} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" name="Interactions" fill="#3B82F6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
