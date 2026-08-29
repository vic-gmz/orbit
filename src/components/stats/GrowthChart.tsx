import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { GrowthMonth } from "../../types";
import ChartTooltip from "./ChartTooltip";

const SUN = "#E8A04C";
const CORAL = "#E47A5A";
const SAND = "#EADFCA";
const MUTED = "#96876F";

function monthLabel(key: string): string {
  const [y, m] = key.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString(undefined, {
    month: "short",
  });
}

export default function GrowthChart({ data }: { data: GrowthMonth[] }) {
  const points = data.map((m, i) => ({
    label: monthLabel(m.month),
    count: data.slice(0, i + 1).reduce((sum, x) => sum + x.count, 0),
  }));

  if (points.every((p) => p.count === 0)) {
    return <p className="text-sm text-muted">No data yet</p>;
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={points} margin={{ top: 8, right: 16, left: -8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={SAND} vertical={false} />
          <XAxis dataKey="label" tick={{ fill: MUTED, fontSize: 12 }} axisLine={{ stroke: SAND }} tickLine={false} />
          <YAxis
            allowDecimals={false}
            tick={{ fill: MUTED, fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ stroke: CORAL, strokeWidth: 1.5 }} />
          <Line
            type="monotone"
            dataKey="count"
            name="Contacts"
            stroke={SUN}
            strokeWidth={2.5}
            dot={{ fill: CORAL, strokeWidth: 0, r: 3 }}
            activeDot={{ r: 5, fill: CORAL, stroke: "#FFFDF7", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
