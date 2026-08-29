import { Link } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Contact } from "../../types";
import { formatRelativeDate } from "../../lib/format";
import AuraAvatar from "../ui/AuraAvatar";

export default function ContactCard({
  contact,
  companyName,
}: {
  contact: Contact;
  companyName?: string;
}) {
  const avatarUrl = useQuery(
    api.contacts.getAvatarUrl,
    contact.avatarStorageId
      ? { storageId: contact.avatarStorageId }
      : "skip",
  );

  const meta = [contact.role, companyName].filter(Boolean).join(" · ");

  return (
    <Link
      to={`/contacts/${contact._id}`}
      className="card flex items-center gap-3 p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-sand-deep hover:shadow-lift"
    >
      <AuraAvatar
        src={avatarUrl}
        name={contact.name}
        interactionCount={contact.interactionCount}
      />
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-ink">{contact.name}</p>
        {meta && <p className="truncate text-sm text-muted">{meta}</p>}
      </div>
      <p className="shrink-0 text-xs text-muted">
        {formatRelativeDate(contact.lastInteractionAt)}
      </p>
    </Link>
  );
}
