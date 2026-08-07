import { NavLink } from "react-router-dom";
import { useQuery } from "convex/react";
import { authClient } from "../../lib/auth-client";
import { api } from "../../../convex/_generated/api";
import { getLevel } from "../../lib/gamification";
import { useStreak } from "../../hooks/useStreak";

const links = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/companies", label: "Companies", end: false },
  { to: "/contacts", label: "Contacts", end: false },
  { to: "/stats", label: "Stats", end: false },
];

export default function Sidebar() {
  const contacts = useQuery(api.contacts.list, {});
  const { current: streak, loading: streakLoading } = useStreak();

  const totalInteractions =
    contacts?.reduce((sum, c) => sum + c.interactionCount, 0) ?? 0;
  const level = getLevel(totalInteractions);

  return (
    <aside className="flex w-52 shrink-0 flex-col border-r p-4">
      <h1 className="mb-6 text-lg font-bold">Orbit</h1>
      <nav className="flex flex-col gap-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              isActive ? "rounded bg-gray-200 px-3 py-2" : "rounded px-3 py-2"
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-6 flex flex-col gap-1 text-sm text-gray-600">
        <span>
          {level.emoji} Level {level.level} — {level.title}
        </span>
        <span>{streakLoading ? "…" : `🔥 ${streak} streak`}</span>
      </div>
      <button
        className="mt-auto px-3 py-2 text-left text-sm text-gray-500"
        onClick={() => authClient.signOut()}
      >
        Sign out
      </button>
    </aside>
  );
}
