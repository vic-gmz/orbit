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
      className="flex items-center gap-3 rounded border p-3"
    >
      <AuraAvatar
        src={avatarUrl}
        name={contact.name}
        interactionCount={contact.interactionCount}
      />
      <div className="min-w-0 flex-1">
        <p className="font-medium">{contact.name}</p>
        {meta && (
          <p className="truncate text-sm text-gray-500">{meta}</p>
        )}
      </div>
      <p className="shrink-0 text-sm text-gray-500">
        {formatRelativeDate(contact.lastInteractionAt)}
      </p>
    </Link>
  );
}
