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
    return <p>Loading...</p>;
  }

  if (contacts.length === 0) {
    return (
      <div className="flex flex-col gap-4">
        <h1 className="text-xl">Dashboard</h1>
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
    <div className="flex flex-col gap-4">
      <h1 className="text-xl">Dashboard</h1>
      <div className="grid grid-cols-2 gap-4">
        <WeeklyGoalWidget />
        <StreakDisplay />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <RecentInteractions />
        <PendingFollowUps />
      </div>
    </div>
  );
}
