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
      className={
        company.isTracked
          ? "rounded border px-2 py-1 text-sm"
          : "rounded border px-2 py-1 text-sm text-gray-500"
      }
      onClick={() => toggleTracked({ id: company._id })}
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
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl">Companies</h1>
        <Link
          to="/companies/new"
          className="rounded bg-black px-3 py-2 text-white"
        >
          + Add company
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search companies..."
          className="rounded border px-3 py-2"
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={trackedOnly}
            onChange={(e) => setTrackedOnly(e.target.checked)}
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
        <ul className="flex flex-col gap-2">
          {filtered!.map((c) => (
            <li
              key={c._id}
              className="flex items-center justify-between rounded border p-3"
            >
              <Link to={`/companies/${c._id}`} className="flex flex-col">
                <span className="font-medium">{c.name}</span>
                <span className="text-sm text-gray-500">
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
