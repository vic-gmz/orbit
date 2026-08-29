import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Link } from "react-router-dom";
import { formatRelativeDate } from "../../lib/format";
import { INTERACTION_TYPE_LABELS } from "../../lib/interactionTypes";

export default function RecentInteractions() {
  const recent = useQuery(api.interactions.recent, {});

  if (recent === undefined) {
    return (
      <section className="card p-5">
        <p className="text-sm text-muted">Loading…</p>
      </section>
    );
  }

  return (
    <section className="card flex flex-col gap-3 p-5">
      <h2 className="section-title">Recent interactions</h2>
      {recent.length === 0 ? (
        <p className="text-sm text-muted">
          No interactions yet. Log your first one from a contact.
        </p>
      ) : (
        <ul className="flex flex-col divide-y divide-sand/60">
          {recent.map((i) => (
            <li key={i._id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
              <div className="min-w-0">
                <Link to={`/contacts/${i.contact._id}`} className="link">
                  {i.contact.name}
                </Link>
                <span className="text-muted">
                  {" "}
                  · {INTERACTION_TYPE_LABELS[i.type]}
                </span>
              </div>
              <span className="shrink-0 text-xs text-muted">
                {formatRelativeDate(i.date)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
