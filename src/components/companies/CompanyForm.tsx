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

  if (isEdit && company === undefined) return <p>Loading...</p>;
  if (isEdit && company === null) {
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
    <div className="flex flex-col gap-4">
      <Link to="/companies" className="text-sm text-gray-500">
        ← Back
      </Link>
      <h1 className="text-xl">{initial ? "Edit company" : "New company"}</h1>
      <form
        className="flex max-w-md flex-col gap-3"
        onSubmit={handleSubmit}
      >
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="rounded border px-3 py-2"
        />
        <input
          placeholder="Website (optional)"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          className="rounded border px-3 py-2"
        />
        <input
          placeholder="Industry (optional)"
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          className="rounded border px-3 py-2"
        />
        <textarea
          placeholder="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="rounded border px-3 py-2"
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isTracked}
            onChange={(e) => setIsTracked(e.target.checked)}
          />
          Tracked
        </label>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex gap-2">
          <button
            type="submit"
            className="rounded bg-black px-3 py-2 text-white"
          >
            {initial ? "Save" : "Create"}
          </button>
          <Link
            to="/companies"
            className="rounded border px-3 py-2"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
