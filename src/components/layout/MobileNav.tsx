import { NavLink } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

const links = [
  {
    to: "/",
    label: "Dashboard",
    end: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
        <polyline points="9 21 9 14 15 14 15 21" />
      </svg>
    ),
  },
  {
    to: "/companies",
    label: "Companies",
    end: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <rect x="4" y="2" width="16" height="20" rx="1.5" />
        <path d="M9 22V12h6v10" />
        <path d="M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01" />
      </svg>
    ),
  },
  {
    to: "/contacts",
    label: "Contacts",
    end: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <circle cx="9" cy="7" r="4" />
        <path d="M1 21v-2a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v2" />
        <circle cx="19" cy="7" r="2.5" />
        <path d="M23 21v-1.5a3 3 0 0 0-2.5-3" />
      </svg>
    ),
  },
  {
    to: "/stats",
    label: "Stats",
    end: false,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <rect x="3" y="12" width="4" height="9" rx="1" />
        <rect x="10" y="7" width="4" height="14" rx="1" />
        <rect x="17" y="3" width="4" height="18" rx="1" />
      </svg>
    ),
  },
];

export default function MobileNav() {
  const pendingFollowUps = useQuery(api.interactions.pendingFollowUps, {});
  const pendingCount = pendingFollowUps?.length ?? 0;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-sand bg-paper/90 backdrop-blur md:hidden">
      <div className="flex items-stretch">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[0.65rem] font-medium transition-colors ${
                isActive
                  ? "text-ink"
                  : "text-muted hover:text-ink-soft"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className="relative flex items-center justify-center">
                  {isActive && (
                    <span className="nav-dot absolute -top-1 right-0 h-1.5 w-1.5" aria-hidden="true" />
                  )}
                  {link.icon}
                  {link.to === "/" && pendingCount > 0 && (
                    <span className="absolute -right-2 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-coral px-1 text-[0.5rem] font-bold leading-none text-white">
                      {pendingCount}
                    </span>
                  )}
                </span>
                <span>{link.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
