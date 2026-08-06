import { Link } from "react-router-dom";
import type { Contact } from "../../types";

export default function ContactCard({ contact }: { contact: Contact }) {
  const initials = contact.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <Link
      to={`/contacts/${contact._id}`}
      className="flex items-center gap-3 rounded border p-3"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-200 text-sm">
        {initials}
      </div>
      <div>
        <p className="font-medium">{contact.name}</p>
        {contact.role && <p className="text-sm text-gray-500">{contact.role}</p>}
      </div>
    </Link>
  );
}
