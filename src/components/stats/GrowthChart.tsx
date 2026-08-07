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
    return <p className="text-sm text-gray-500">No data yet</p>;
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={points} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="count"
            name="Contacts"
            stroke="#3B82F6"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
