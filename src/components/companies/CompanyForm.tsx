import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { Company, CompanyId } from "../../types";

export default function CompanyForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const company = useQuery(
    api.companies.get,
    isEdit ? { id: id as CompanyId } : "skip",
  );

  if (isEdit && company === undefined) return <p className="text-sm text-muted">Loading…</p>;
  if (isEdit && company === null) {
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
    <CompanyFormFields key={company?._id ?? "new"} initial={company ?? undefined} />
  );
}

function CompanyFormFields({ initial }: { initial?: Company }) {
  const [name, setName] = useState(initial?.name ?? "");
  const [website, setWebsite] = useState(initial?.website ?? "");
  const [industry, setIndustry] = useState(initial?.industry ?? "");
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [isTracked, setIsTracked] = useState(initial?.isTracked ?? false);
  const [error, setError] = useState<string | null>(null);
  const create = useMutation(api.companies.create);
  const update = useMutation(api.companies.update);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (initial) {
        await update({
          id: initial._id,
          name,
          website,
          industry,
          notes,
          isTracked,
        });
        navigate("/companies");
      } else {
        const id = await create({
          name,
          website: website || undefined,
          industry: industry || undefined,
          notes: notes || undefined,
          isTracked,
        });
        navigate(`/companies/${id}`);
      }
    } catch {
      setError("Something went wrong. Try again.");
    }
  };

  return (
    <div className="stagger mx-auto flex w-full max-w-xl flex-col gap-5">
      <Link to="/companies" className="link text-sm font-semibold">
        ← Back
      </Link>
      <h1 className="page-title">
        {initial ? "Edit company" : "New company"}
      </h1>

      <form className="card flex flex-col gap-3.5 p-5 sm:p-6" onSubmit={handleSubmit}>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="input"
        />
        <input
          placeholder="Website (optional)"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          className="input"
        />
        <input
          placeholder="Industry (optional)"
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          className="input"
        />
        <textarea
          placeholder="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          className="input resize-y"
        />
        <label className="flex cursor-pointer items-center gap-2 text-sm text-ink-soft">
          <input
            type="checkbox"
            checked={isTracked}
            onChange={(e) => setIsTracked(e.target.checked)}
            className="h-4 w-4 accent-sun"
          />
          Tracked
        </label>
        {error && <p className="text-sm text-coral">{error}</p>}
        <div className="flex gap-2 pt-1">
          <button type="submit" className="btn btn-primary">
            {initial ? "Save" : "Create"}
          </button>
          <Link to="/companies" className="btn btn-ghost">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
