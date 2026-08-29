import { useMemo } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Link } from "react-router-dom";
import { formatDate } from "../../lib/format";

export default function PendingFollowUps() {
  const pending = useQuery(api.interactions.pendingFollowUps, {});
  const markDone = useMutation(api.interactions.markFollowUpDone);

  const startOfToday = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }, []);

  if (pending === undefined) {
    return (
      <section className="card p-5">
        <p className="text-sm text-muted">Loading…</p>
      </section>
    );
  }

  return (
    <section className="card flex flex-col gap-3 p-5">
      <h2 className="section-title">Pending follow-ups</h2>
      {pending.length === 0 ? (
        <p className="text-sm text-muted">Nothing waiting — nice.</p>
      ) : (
        <ul className="flex flex-col divide-y divide-sand/60">
          {pending.map((i) => {
            const overdue =
              i.followUpDate !== undefined && i.followUpDate < startOfToday;
            return (
              <li
                key={i._id}
                className="flex items-center justify-between gap-3 py-2.5 text-sm"
              >
                <div className="min-w-0">
                  <Link to={`/contacts/${i.contact._id}`} className="link">
                    {i.contact.name}
                  </Link>
                  <span className={overdue ? "text-coral" : "text-muted"}>
                    {" "}
                    · since{" "}
                    {i.followUpDate ? formatDate(i.followUpDate) : "—"}
                  </span>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {overdue && (
                    <span className="rounded-full bg-coral/15 px-2 py-0.5 text-xs font-semibold text-coral">
                      Overdue
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => markDone({ id: i._id })}
                    className="btn btn-ghost btn-sm"
                  >
                    Mark done
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
