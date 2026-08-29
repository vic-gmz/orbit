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
import ChartTooltip from "./ChartTooltip";

const SUN = "#E8A04C";
const SAND = "#EADFCA";
const MUTED = "#96876F";

export default function WeeklyChart({ data }: { data: WeeklyCount[] }) {
  const points = data.map((w) => ({
    label: new Date(w.weekStart).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    }),
    count: w.count,
  }));

  if (points.every((p) => p.count === 0)) {
    return <p className="text-sm text-muted">No data yet</p>;
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={points} margin={{ top: 8, right: 16, left: -8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={SAND} vertical={false} />
          <XAxis dataKey="label" tick={{ fill: MUTED, fontSize: 12 }} axisLine={{ stroke: SAND }} tickLine={false} />
          <YAxis
            allowDecimals={false}
            tick={{ fill: MUTED, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgb(232 160 76 / 0.08)" }} />
          <Bar
            dataKey="count"
            name="Interactions"
            fill={SUN}
            radius={[6, 6, 0, 0]}
            maxBarSize={28}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
