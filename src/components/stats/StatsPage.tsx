import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import GrowthChart from "./GrowthChart";
import WeeklyChart from "./WeeklyChart";
import StreakHistory from "./StreakHistory";
import BadgeGrid from "./BadgeGrid";

export default function StatsPage() {
  const contacts = useQuery(api.contacts.list, {});
  const companies = useQuery(api.companies.list, {});
  const goal = useQuery(api.goals.get, {});
  const growth = useQuery(api.contacts.growthByMonth, {});
  const weekly = useQuery(api.interactions.weeklyCounts, {});
  const achievements = useQuery(api.achievements.list, {});

  if (
    contacts === undefined ||
    companies === undefined ||
    goal === undefined ||
    growth === undefined ||
    weekly === undefined ||
    achievements === undefined
  ) {
    return <p>Loading...</p>;
  }

  const totalInteractions = contacts.reduce(
    (sum, c) => sum + c.interactionCount,
    0,
  );
  const trackedCompanies = companies.filter((c) => c.isTracked).length;
  const currentStreak = goal?.currentStreak ?? 0;

  const cards = [
    { label: "Total contacts", value: contacts.length },
    { label: "Total interactions", value: totalInteractions },
    { label: "Current streak", value: currentStreak },
    { label: "Companies tracked", value: trackedCompanies },
  ];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl">Stats</h1>

      <div className="grid grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="rounded border p-4 text-center">
            <p className="text-sm text-gray-500">{card.label}</p>
            <p className="text-2xl">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <section className="rounded border p-4">
          <h2 className="mb-2 font-medium">Contacts over time</h2>
          <GrowthChart data={growth} />
        </section>
        <section className="rounded border p-4">
          <h2 className="mb-2 font-medium">Interactions per week</h2>
          <WeeklyChart data={weekly} />
        </section>
      </div>

      <section className="rounded border p-4">
        <h2 className="mb-2 font-medium">Streak history</h2>
        <StreakHistory goal={goal} weekly={weekly} />
      </section>

      <section className="rounded border p-4">
        <h2 className="mb-2 font-medium">Achievements</h2>
        <BadgeGrid achievements={achievements} />
      </section>
    </div>
  );
}
