import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { CompanyId } from "../../types";
import ContactCard from "../contacts/ContactCard";
import EmptyState from "../ui/EmptyState";

export default function CompanyDetail() {
  const { id } = useParams();
  const companyId = id as CompanyId;
  const company = useQuery(api.companies.get, { id: companyId });
  const contacts = useQuery(api.companies.getContacts, { companyId });
  const remove = useMutation(api.companies.remove);
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!company) return;
    if (!window.confirm(`Delete ${company.name}? This cannot be undone.`)) return;
    await remove({ id: company._id });
    navigate("/companies");
  };

  if (company === undefined || contacts === undefined) {
    return <p className="text-sm text-muted">Loading…</p>;
  }

  if (company === null) {
    return (
      <p className="text-sm text-muted">
        Not found.{" "}
        <Link to="/companies" className="link">
          Back to companies
        </Link>
      </p>
    );
  }

  return (
    <div className="stagger mx-auto flex w-full max-w-3xl flex-col gap-6">
      <Link to="/companies" className="link text-sm font-semibold">
        ← Back
      </Link>

      <div className="card flex flex-col gap-4 p-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">
            {company.name}
          </h1>
          {company.industry && <p className="text-muted">{company.industry}</p>}
          {company.website && (
            <a
              href={company.website}
              target="_blank"
              rel="noreferrer"
              className="link text-sm"
            >
              {company.website}
            </a>
          )}
          {company.notes && (
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-ink-soft">
              {company.notes}
            </p>
          )}
          <p className="mt-3 text-sm text-muted">
            {company.isTracked ? "★ Tracked" : "☆ Untracked"}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to={`/companies/${company._id}/edit`}
            className="btn btn-ghost btn-sm"
          >
            Edit
          </Link>
          <button
            className="btn btn-danger btn-sm"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="section-title">Contacts</h2>
          <Link
            to={`/contacts/new?companyId=${company._id}`}
            className="btn btn-primary btn-sm"
          >
            + Add contact
          </Link>
        </div>
        {contacts.length === 0 ? (
          <div className="mt-2">
            <EmptyState
              title="No contacts at this company yet."
              message="Add someone you know at this company."
              actionLabel="+ Add contact"
              actionTo={`/contacts/new?companyId=${company._id}`}
            />
          </div>
        ) : (
          <ul className="mt-3 flex flex-col gap-2.5">
            {contacts.map((c) => (
              <li key={c._id}>
                <ContactCard contact={c} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
