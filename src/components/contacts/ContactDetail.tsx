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
    return <p>Loading...</p>;
  }

  if (contact === null) {
    return (
      <p>
        Not found.{" "}
        <Link to="/contacts" className="underline">
          Back to contacts
        </Link>
      </p>
    );
  }

  return (
    <div className="flex max-w-2xl flex-col gap-4">
      <Link to="/contacts" className="text-sm text-gray-500">
        ← Back
      </Link>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <AuraAvatar
            src={avatarUrl}
            name={contact.name}
            interactionCount={contact.interactionCount}
            size={64}
          />
          <div>
            <h1 className="text-xl">{contact.name}</h1>
            {contact.role && <p className="text-gray-500">{contact.role}</p>}
            {company && (
              <Link
                to={`/companies/${company._id}`}
                className="text-blue-600"
              >
                {company.name}
              </Link>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            to={`/contacts/${contact._id}/edit`}
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

      {(contact.email || contact.linkedinUrl || contact.githubUrl) && (
        <div className="flex flex-col gap-1 text-sm">
          {contact.email && (
            <a href={`mailto:${contact.email}`} className="text-blue-600">
              {contact.email}
            </a>
          )}
          {contact.linkedinUrl && (
            <a
              href={contact.linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600"
            >
              LinkedIn
            </a>
          )}
          {contact.githubUrl && (
            <a
              href={contact.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600"
            >
              GitHub
            </a>
          )}
        </div>
      )}

      <div>
        <h2 className="text-lg">Tags</h2>
        <div className="mt-1">
          <TagManager contactId={contact._id} />
        </div>
      </div>

      {contact.personalProjects && (
        <div>
          <h2 className="text-lg">Personal projects</h2>
          <p className="whitespace-pre-wrap">{contact.personalProjects}</p>
        </div>
      )}

      {contact.notes && (
        <div>
          <h2 className="text-lg">Notes</h2>
          <p className="whitespace-pre-wrap">{contact.notes}</p>
        </div>
      )}

      <div>
        <h2 className="text-lg">Log interaction</h2>
        <div className="mt-1">
          <InteractionForm
            contactId={contact._id}
            onCreated={handleInteractionCreated}
          />
        </div>
      </div>

      <div>
        <h2 className="text-lg">Interactions</h2>
        <div className="mt-1">
          <InteractionTimeline interactions={interactions} />
        </div>
      </div>

      <p className="text-sm text-gray-500">
        {contact.interactionCount} interactions · last{" "}
        {contact.lastInteractionAt
          ? formatDate(contact.lastInteractionAt)
          : "never"}
      </p>
    </div>
  );
}
