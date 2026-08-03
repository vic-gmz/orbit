import { NavLink } from "react-router-dom";
import { authClient } from "../../lib/auth-client";

const links = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/companies", label: "Companies", end: false },
  { to: "/contacts", label: "Contacts", end: false },
  { to: "/stats", label: "Stats", end: false },
];

export default function Sidebar() {
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
      <button
        className="mt-auto px-3 py-2 text-left text-sm text-gray-500"
        onClick={() => authClient.signOut()}
      >
        Sign out
      </button>
    </aside>
  );
}
