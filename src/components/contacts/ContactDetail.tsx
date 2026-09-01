import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { AchievementType, ContactId } from "../../types";
import { formatDate } from "../../lib/format";
import { ACHIEVEMENTS } from "../../lib/gamification";
import { toast } from "../../lib/toast";
import TagManager from "../tags/TagManager";
import InteractionForm from "../interactions/InteractionForm";
import InteractionTimeline from "../interactions/InteractionTimeline";
import AuraAvatar from "../ui/AuraAvatar";

export default function ContactDetail() {
  const { id } = useParams();
  const contactId = id as ContactId;

  const contact = useQuery(api.contacts.get, { id: contactId });
  const avatarUrl = useQuery(
    api.contacts.getAvatarUrl,
    contact?.avatarStorageId
      ? { storageId: contact.avatarStorageId }
      : "skip",
  );
  const company = useQuery(
    api.companies.get,
    contact?.companyId ? { id: contact.companyId } : "skip",
  );
  const interactions = useQuery(api.interactions.listByContact, { contactId });

  const remove = useMutation(api.contacts.remove);
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!contact) return;
    if (!window.confirm(`Delete ${contact.name}? This cannot be undone.`)) return;
    await remove({ id: contact._id });
    navigate("/contacts");
  };

  const handleInteractionCreated = (achievements: AchievementType[]) => {
    for (const type of achievements) {
      const def = ACHIEVEMENTS.find((a) => a.id === type);
      if (def) toast(def.toast);
    }
  };

  if (contact === undefined || interactions === undefined) {
    return <p className="text-sm text-muted">Loading…</p>;
  }

  if (contact === null) {
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
    <div className="stagger mx-auto flex w-full max-w-2xl flex-col gap-6">
      <Link to="/contacts" className="link text-sm font-semibold">
        ← Back
      </Link>

      <div className="card flex flex-col gap-5 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-4">
            <AuraAvatar
              src={avatarUrl}
              name={contact.name}
              interactionCount={contact.interactionCount}
              size={64}
            />
            <div>
              <h1 className="font-display text-2xl font-semibold text-ink">
                {contact.name}
              </h1>
              {contact.role && <p className="text-muted">{contact.role}</p>}
              {company && (
                <Link
                  to={`/companies/${company._id}`}
                  className="link text-sm"
                >
                  {company.name}
                </Link>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              to={`/contacts/${contact._id}/edit`}
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

        {(contact.email || contact.linkedinUrl || contact.githubUrl) && (
          <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
            {contact.email && (
              <a href={`mailto:${contact.email}`} className="link">
                {contact.email}
              </a>
            )}
            {contact.linkedinUrl && (
              <a
                href={contact.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="link"
              >
                LinkedIn
              </a>
            )}
            {contact.githubUrl && (
              <a
                href={contact.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="link"
              >
                GitHub
              </a>
            )}
          </div>
        )}

        <div>
          <h2 className="section-title">Tags</h2>
          <div className="mt-2">
            <TagManager contactId={contact._id} />
          </div>
        </div>

        {contact.personalProjects && (
          <div>
            <h2 className="section-title">Personal projects</h2>
            <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-ink-soft">
              {contact.personalProjects}
            </p>
          </div>
        )}

        {contact.notes && (
          <div>
            <h2 className="section-title">Notes</h2>
            <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-ink-soft">
              {contact.notes}
            </p>
          </div>
        )}

        <p className="text-xs text-muted">
          {contact.interactionCount} interactions · last{" "}
          {contact.lastInteractionAt
            ? formatDate(contact.lastInteractionAt)
            : "never"}
        </p>
      </div>

      <section>
        <h2 className="section-title">Log interaction</h2>
        <div className="mt-2">
          <InteractionForm
            contactId={contact._id}
            onCreated={handleInteractionCreated}
          />
        </div>
      </section>

      <section>
        <h2 className="section-title">Interactions</h2>
        <div className="mt-2">
          <InteractionTimeline interactions={interactions} />
        </div>
      </section>
    </div>
  );
}
