import { useMemo, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Link } from "react-router-dom";
import type { Company } from "../../types";
import EmptyState from "../ui/EmptyState";

function TrackedToggle({ company }: { company: Company }) {
  const toggleTracked = useMutation(api.companies.toggleTracked);
  return (
    <button
      type="button"
      className={
        company.isTracked
          ? "chip border-sun-soft bg-sun-soft/60 text-sun hover:bg-sun-soft"
          : "chip hover:bg-sand/40 hover:text-ink-soft"
      }
      onClick={() => toggleTracked({ id: company._id })}
      aria-pressed={company.isTracked}
    >
      {company.isTracked ? "★ Tracked" : "☆ Untracked"}
    </button>
  );
}

export default function CompaniesPage() {
  const companies = useQuery(api.companies.list, {});
  const contacts = useQuery(api.contacts.list, {});
  const [search, setSearch] = useState("");
  const [trackedOnly, setTrackedOnly] = useState(false);

  const contactsByCompany = useMemo(() => {
    const map = new Map<string, number>();
    if (contacts) {
      for (const c of contacts) {
        if (c.companyId) {
          map.set(c.companyId, (map.get(c.companyId) ?? 0) + 1);
        }
      }
    }
    return map;
  }, [contacts]);

  const filtered = useMemo(() => {
    if (!companies) return undefined;
    let list = companies;
    if (trackedOnly) list = list.filter((c) => c.isTracked);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((c) => c.name.toLowerCase().includes(q));
    }
    return list;
  }, [companies, search, trackedOnly]);

  if (companies === undefined || contacts === undefined) {
    return <p className="text-sm text-muted">Loading…</p>;
  }

  return (
    <div className="stagger flex flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="page-title">Companies</h1>
          <p className="mt-1 text-sm text-muted">
            The places your people orbit around.
          </p>
        </div>
        <Link to="/companies/new" className="btn btn-primary">
          + Add company
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search companies..."
          aria-label="Search companies"
          className="input w-full sm:w-64"
        />
        <label className="flex cursor-pointer items-center gap-2 text-sm text-ink-soft">
          <input
            type="checkbox"
            checked={trackedOnly}
            onChange={(e) => setTrackedOnly(e.target.checked)}
            className="h-4 w-4 accent-sun"
          />
          Tracked only
        </label>
      </div>

      {filtered!.length === 0 ? (
        search || trackedOnly ? (
          <EmptyState
            title={`No results for "${search}".`}
            message="Try a different search or clear the filters."
          />
        ) : (
          <EmptyState
            title="No companies yet."
            message="Track the companies you're building relationships with."
            actionLabel="Create your first one!"
            actionTo="/companies/new"
          />
        )
      ) : (
        <ul className="flex flex-col gap-2.5">
          {filtered!.map((c) => (
            <li
              key={c._id}
              className="card flex items-center justify-between gap-3 p-4 transition-all duration-200 hover:border-sand-deep hover:shadow-lift"
            >
              <Link to={`/companies/${c._id}`} className="flex min-w-0 flex-col">
                <span className="font-semibold text-ink">{c.name}</span>
                <span className="text-sm text-muted">
                  {c.industry ?? "No industry"} ·{" "}
                  {contactsByCompany.get(c._id) ?? 0} contacts
                </span>
              </Link>
              <TrackedToggle company={c} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
