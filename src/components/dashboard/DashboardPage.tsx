import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Link } from "react-router-dom";
import WeeklyGoalWidget from "./WeeklyGoalWidget";
import StreakDisplay from "./StreakDisplay";
import RecentInteractions from "./RecentInteractions";
import PendingFollowUps from "./PendingFollowUps";

export default function DashboardPage() {
  const contacts = useQuery(api.contacts.list, {});

  if (contacts === undefined) {
    return <p>Loading...</p>;
  }

  if (contacts.length === 0) {
    return (
      <div className="flex flex-col gap-2">
        <h1 className="text-xl">Dashboard</h1>
        <p>No contacts yet. Add your first one to start networking!</p>
        <Link to="/contacts/new" className="text-blue-600">
          Add a contact
        </Link>
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
