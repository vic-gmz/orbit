import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import GrowthChart from "./GrowthChart";
import WeeklyChart from "./WeeklyChart";
import StreakHistory from "./StreakHistory";
import BadgeGrid from "./BadgeGrid";
import EmptyState from "../ui/EmptyState";

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
    return <p className="text-sm text-muted">Loading…</p>;
  }

  if (contacts.length === 0) {
    return (
      <div className="stagger flex flex-col gap-5">
        <div>
          <h1 className="page-title">Stats</h1>
          <p className="mt-1 text-sm text-muted">
            Your orbit, measured in warm moments.
          </p>
        </div>
        <EmptyState
          title="No data yet."
          message="Add contacts and log interactions to see your stats."
          actionLabel="Add a contact"
          actionTo="/contacts/new"
        />
      </div>
    );
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
    <div className="stagger flex flex-col gap-6">
      <div>
        <h1 className="page-title">Stats</h1>
        <p className="mt-1 text-sm text-muted">
          Your orbit, measured in warm moments.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="card p-5 text-center">
            <p className="text-sm text-muted">{card.label}</p>
            <p className="font-display text-3xl font-semibold text-ink">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <section className="card p-5">
          <h2 className="section-title mb-3">Contacts over time</h2>
          <GrowthChart data={growth} />
        </section>
        <section className="card p-5">
          <h2 className="section-title mb-3">Interactions per week</h2>
          <WeeklyChart data={weekly} />
        </section>
      </div>

      <section className="card p-5">
        <h2 className="section-title mb-3">Streak history</h2>
        <StreakHistory goal={goal} weekly={weekly} />
      </section>

      <section className="card p-5">
        <h2 className="section-title mb-3">Achievements</h2>
        <BadgeGrid achievements={achievements} />
      </section>
    </div>
  );
}
