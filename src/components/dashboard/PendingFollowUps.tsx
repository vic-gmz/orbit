import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Link } from "react-router-dom";
import { formatDate } from "../../lib/format";

export default function PendingFollowUps() {
  const pending = useQuery(api.interactions.pendingFollowUps, {});
  const markDone = useMutation(api.interactions.markFollowUpDone);

  if (pending === undefined) {
    return <p className="text-sm text-gray-500">Loading...</p>;
  }

  return (
    <section className="flex flex-col gap-2 rounded border p-4">
      <h2 className="font-medium">Pending follow-ups</h2>
      {pending.length === 0 ? (
        <p className="text-sm text-gray-500">No pending follow-ups</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {pending.map((i) => (
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
                  · since{" "}
                  {i.followUpDate ? formatDate(i.followUpDate) : "—"}
                </span>
              </div>
              <button
                type="button"
                onClick={() => markDone({ id: i._id })}
                className="rounded border px-2 py-1 text-xs"
              >
                Mark done
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
