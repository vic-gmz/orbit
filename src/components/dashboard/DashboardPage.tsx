import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import WeeklyGoalWidget from "./WeeklyGoalWidget";
import StreakDisplay from "./StreakDisplay";
import RecentInteractions from "./RecentInteractions";
import PendingFollowUps from "./PendingFollowUps";
import EmptyState from "../ui/EmptyState";

export default function DashboardPage() {
  const contacts = useQuery(api.contacts.list, {});

  if (contacts === undefined) {
    return <p className="text-sm text-muted">Loading…</p>;
  }

  if (contacts.length === 0) {
    return (
      <div className="stagger flex flex-col gap-5">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="mt-1 text-sm text-muted">
            A quiet place to tend your network.
          </p>
        </div>
        <EmptyState
          title="No contacts yet."
          message="Add your first contact to start networking."
          actionLabel="Add a contact"
          actionTo="/contacts/new"
        />
      </div>
    );
  }

  return (
    <div className="stagger flex flex-col gap-5">
      <div>
        <h1 className="page-title">Dashboard</h1>
        <p className="mt-1 text-sm text-muted">
          A quiet place to tend your network.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <WeeklyGoalWidget />
        <StreakDisplay />
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <RecentInteractions />
        <PendingFollowUps />
      </div>
    </div>
  );
}
