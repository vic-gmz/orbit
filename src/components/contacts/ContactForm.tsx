import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import type { CompanyId, Contact, ContactId } from "../../types";

export default function ContactForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [searchParams] = useSearchParams();
  const initialCompanyId = searchParams.get("companyId");

  const contact = useQuery(
    api.contacts.get,
    isEdit ? { id: id as ContactId } : "skip",
  );

  if (isEdit && contact === undefined) return <p className="text-sm text-muted">Loading…</p>;
  if (isEdit && contact === null) {
    return (
      <p className="text-sm text-muted">
        Not found.{" "}
        <Link to="/contacts" className="link">
          Back to contacts
        </Link>
      </p>
    );
  }

  return (
    <ContactFormFields
      key={contact?._id ?? "new"}
      initial={contact ?? undefined}
      initialCompanyId={initialCompanyId ?? undefined}
    />
  );
}

function ContactFormFields({
  initial,
  initialCompanyId,
}: {
  initial?: Contact;
  initialCompanyId?: string;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [linkedinUrl, setLinkedinUrl] = useState(initial?.linkedinUrl ?? "");
  const [githubUrl, setGithubUrl] = useState(initial?.githubUrl ?? "");
  const [role, setRole] = useState(initial?.role ?? "");
  const [companyId, setCompanyId] = useState(initial?.companyId ?? initialCompanyId ?? "");
  const [personalProjects, setPersonalProjects] = useState(
    initial?.personalProjects ?? "",
  );
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const companies = useQuery(api.companies.list, {});
  const avatarUrl = useQuery(
    api.contacts.getAvatarUrl,
    initial?.avatarStorageId
      ? { storageId: initial.avatarStorageId }
      : "skip",
  );

  const create = useMutation(api.contacts.create);
  const update = useMutation(api.contacts.update);
  const generateUploadUrl = useMutation(api.contacts.generateUploadUrl);
  const setAvatar = useMutation(api.contacts.setAvatar);
  const navigate = useNavigate();

  const uploadAvatar = async (contactId: ContactId, file: File) => {
    const uploadUrl = await generateUploadUrl();
    const res = await fetch(uploadUrl, {
      method: "POST",
      headers: { "Content-Type": file.type },
      body: file,
    });
    const { storageId } = (await res.json()) as { storageId: string };
    await setAvatar({ contactId, storageId });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const companyIdArg = companyId ? (companyId as CompanyId) : undefined;
      if (initial) {
        await update({
          id: initial._id,
          name,
          email: email || undefined,
          linkedinUrl: linkedinUrl || undefined,
          githubUrl: githubUrl || undefined,
          role: role || undefined,
          companyId: companyIdArg,
          personalProjects: personalProjects || undefined,
          notes: notes || undefined,
        });
        if (avatarFile) await uploadAvatar(initial._id, avatarFile);
        navigate(`/contacts/${initial._id}`);
      } else {
        const contactId = await create({
          name,
          email: email || undefined,
          linkedinUrl: linkedinUrl || undefined,
          githubUrl: githubUrl || undefined,
          role: role || undefined,
          companyId: companyIdArg,
          personalProjects: personalProjects || undefined,
          notes: notes || undefined,
        });
        if (avatarFile) await uploadAvatar(contactId, avatarFile);
        navigate(`/contacts/${contactId}`);
      }
    } catch {
      setError("Something went wrong. Try again.");
    }
  };

  return (
    <div className="stagger mx-auto flex w-full max-w-xl flex-col gap-5">
      <Link to="/contacts" className="link text-sm font-semibold">
        ← Back
      </Link>
      <h1 className="page-title">
        {initial ? "Edit contact" : "New contact"}
      </h1>

      <form
        className="card flex flex-col gap-3.5 p-5 sm:p-6"
        onSubmit={handleSubmit}
      >
        <div className="flex items-center gap-4">
          {(avatarUrl || avatarFile) && (
            <img
              src={avatarFile ? URL.createObjectURL(avatarFile) : avatarUrl ?? ""}
              alt=""
              className="h-16 w-16 rounded-full border-2 border-sand object-cover"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)}
            aria-label="Upload avatar"
            className="w-full text-sm text-muted file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-sun-soft/70 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-ink-soft file:transition-colors hover:file:bg-sun-soft"
          />
        </div>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="input"
        />
        <input
          placeholder="Email (optional)"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input"
        />
        <input
          placeholder="LinkedIn URL (optional)"
          value={linkedinUrl}
          onChange={(e) => setLinkedinUrl(e.target.value)}
          className="input"
        />
        <input
          placeholder="GitHub URL (optional)"
          value={githubUrl}
          onChange={(e) => setGithubUrl(e.target.value)}
          className="input"
        />
        <input
          placeholder="Role (optional)"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="input"
        />
        <select
          value={companyId}
          onChange={(e) => setCompanyId(e.target.value)}
          aria-label="Company"
          className="input"
        >
          <option value="">No company</option>
          {companies?.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
        <textarea
          placeholder="Personal projects (optional)"
          value={personalProjects}
          onChange={(e) => setPersonalProjects(e.target.value)}
          rows={3}
          className="input resize-y"
        />
        <textarea
          placeholder="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="input resize-y"
        />
        {error && <p className="text-sm text-coral">{error}</p>}
        <div className="flex gap-2 pt-1">
          <button type="submit" className="btn btn-primary">
            {initial ? "Save" : "Create"}
          </button>
          <Link to="/contacts" className="btn btn-ghost">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
