import { NavLink } from "react-router-dom";
import { useQuery } from "convex/react";
import { authClient } from "../../lib/auth-client";
import { api } from "../../../convex/_generated/api";
import { getLevel } from "../../lib/gamification";
import { useStreak } from "../../hooks/useStreak";
import OrbitMark from "../ui/OrbitMark";

const links = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/companies", label: "Companies", end: false },
  { to: "/contacts", label: "Contacts", end: false },
  { to: "/stats", label: "Stats", end: false },
];

export default function Sidebar() {
  const contacts = useQuery(api.contacts.list, {});
  const pendingFollowUps = useQuery(api.interactions.pendingFollowUps, {});
  const { current: streak, loading: streakLoading } = useStreak();

  const totalInteractions =
    contacts?.reduce((sum, c) => sum + c.interactionCount, 0) ?? 0;
  const level = getLevel(totalInteractions);
  const pendingCount = pendingFollowUps?.length ?? 0;

  return (
    <aside className="relative z-10 flex w-60 shrink-0 flex-col border-r border-sand bg-paper/70 px-4 py-6 backdrop-blur-sm">
      <div className="mb-8 flex items-center gap-2.5 px-2">
        <OrbitMark size={28} className="text-sun" />
        <span className="font-display text-xl font-semibold tracking-tight text-ink">
          Orbit
        </span>
      </div>

      <nav className="flex flex-col gap-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              isActive
                ? "flex items-center justify-between rounded-xl bg-sun-soft/70 px-3 py-2.5 text-sm font-semibold text-ink shadow-soft transition-colors"
                : "flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-muted transition-colors hover:bg-paper hover:text-ink"
            }
          >
            {({ isActive }) => (
              <>
                <span className="flex items-center gap-2.5">
                  {isActive && (
                    <span className="nav-dot shrink-0" aria-hidden="true" />
                  )}
                  {link.label}
                </span>
                {link.to === "/" && pendingCount > 0 && (
                  <span className="rounded-full bg-coral px-2 py-0.5 text-xs font-semibold text-white">
                    {pendingCount}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-6 rounded-2xl border border-sand bg-paper p-3.5">
        <p className="flex items-center gap-1.5 text-sm">
          <span className="text-base" aria-hidden="true">
            {level.emoji}
          </span>
          <span className="font-semibold text-ink">Level {level.level}</span>
          <span className="text-muted">· {level.title}</span>
        </p>
        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted">
          <span className="flame-flicker text-base" aria-hidden="true">
            🔥
          </span>
          <span>
            {streakLoading ? "…" : `${streak} day streak`}
          </span>
        </p>
      </div>

      <button
        className="btn btn-ghost mt-4 w-full"
        onClick={() => authClient.signOut()}
      >
        Sign out
      </button>
    </aside>
  );
}
