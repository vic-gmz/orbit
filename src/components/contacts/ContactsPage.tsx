import { useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Link } from "react-router-dom";
import type { CompanyId, TagId } from "../../types";
import ContactCard from "./ContactCard";
import EmptyState from "../ui/EmptyState";

export default function ContactsPage() {
  const [search, setSearch] = useState("");
  const [companyId, setCompanyId] = useState<CompanyId | undefined>(undefined);
  const [tagId, setTagId] = useState<TagId | undefined>(undefined);

  const contacts = useQuery(api.contacts.list, { search, companyId, tagId });
  const companies = useQuery(api.companies.list, {});
  const tags = useQuery(api.tags.list, {});

  const companyNames = useMemo(() => {
    const map = new Map<string, string>();
    if (companies) {
      for (const c of companies) map.set(c._id, c.name);
    }
    return map;
  }, [companies]);

  if (contacts === undefined || companies === undefined || tags === undefined) {
    return <p className="text-sm text-muted">Loading…</p>;
  }

  const filtering = search || companyId || tagId;

  return (
    <div className="stagger flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="page-title">Contacts</h1>
          <p className="mt-1 text-sm text-muted">
            The people who make up your orbit.
          </p>
        </div>
        <Link to="/contacts/new" className="btn btn-primary">
          + Add contact
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search contacts..."
          aria-label="Search contacts"
          className="input w-full sm:w-64"
        />
        <select
          value={companyId ?? ""}
          onChange={(e) =>
            setCompanyId(
              e.target.value ? (e.target.value as CompanyId) : undefined,
            )
          }
          aria-label="Filter by company"
          className="input w-full sm:w-auto"
        >
          <option value="">All companies</option>
          {companies.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          value={tagId ?? ""}
          onChange={(e) =>
            setTagId(e.target.value ? (e.target.value as TagId) : undefined)
          }
          aria-label="Filter by tag"
          className="input w-full sm:w-auto"
        >
          <option value="">All tags</option>
          {tags.map((t) => (
            <option key={t._id} value={t._id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      {contacts.length === 0 ? (
        filtering ? (
          <EmptyState
            title="No results for your filters."
            message="Try a different search or clear the filters."
          />
        ) : (
          <EmptyState
            title="No contacts yet."
            message="Start building your professional network."
            actionLabel="Add your first one!"
            actionTo="/contacts/new"
          />
        )
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {contacts.map((c) => (
            <ContactCard
              key={c._id}
              contact={c}
              companyName={c.companyId ? companyNames.get(c.companyId) : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
