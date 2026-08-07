import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Link } from "react-router-dom";
import { formatRelativeDate } from "../../lib/format";
import { INTERACTION_TYPE_LABELS } from "../../lib/interactionTypes";

export default function RecentInteractions() {
  const recent = useQuery(api.interactions.recent, {});

  if (recent === undefined) {
    return <p className="text-sm text-gray-500">Loading...</p>;
  }

  return (
    <section className="flex flex-col gap-2 rounded border p-4">
      <h2 className="font-medium">Recent interactions</h2>
      {recent.length === 0 ? (
        <p className="text-sm text-gray-500">
          No interactions yet. Log your first one from a contact.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {recent.map((i) => (
            <li key={i._id} className="flex items-center justify-between text-sm">
              <div>
                <Link
                  to={`/contacts/${i.contact._id}`}
                  className="text-blue-600"
                >
                  {i.contact.name}
                </Link>
                <span className="text-gray-500">
                  {" "}
                  · {INTERACTION_TYPE_LABELS[i.type]}
                </span>
              </div>
              <span className="text-xs text-gray-500">
                {formatRelativeDate(i.date)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
