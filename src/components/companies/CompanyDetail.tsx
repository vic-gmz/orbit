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
    return <p>Loading...</p>;
  }

  if (company === null) {
    return (
      <p>
        Not found.{" "}
        <Link to="/companies" className="underline">
          Back to companies
        </Link>
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Link to="/companies" className="text-sm text-gray-500">
        ← Back
      </Link>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl">{company.name}</h1>
          {company.industry && (
            <p className="text-gray-500">{company.industry}</p>
          )}
          {company.website && (
            <a
              href={company.website}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600"
            >
              {company.website}
            </a>
          )}
          {company.notes && <p className="mt-2">{company.notes}</p>}
          <p className="mt-1 text-sm text-gray-500">
            {company.isTracked ? "★ Tracked" : "☆ Untracked"}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to={`/companies/${company._id}/edit`}
            className="rounded border px-3 py-2"
          >
            Edit
          </Link>
          <button
            className="rounded border px-3 py-2 text-red-600"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-lg">Contacts</h2>
          <Link
            to={`/contacts/new?companyId=${company._id}`}
            className="rounded bg-black px-3 py-2 text-sm text-white"
          >
            + Add contact
          </Link>
        </div>
        {contacts.length === 0 ? (
          <EmptyState
            title="No contacts at this company yet."
            message="Add someone you know at this company."
            actionLabel="+ Add contact"
            actionTo={`/contacts/new?companyId=${company._id}`}
          />
        ) : (
          <ul className="mt-2 flex flex-col gap-2">
            {contacts.map((c) => (
              <li key={c._id}>
                <ContactCard contact={c} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
