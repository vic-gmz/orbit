import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { ContactId, Tag, TagId } from "../../types";
import TagBadge from "./TagBadge";

export default function TagManager({ contactId }: { contactId: ContactId }) {
  const allTags = useQuery(api.tags.list, {});
  const contactTags = useQuery(api.tags.listByContact, { contactId });

  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState("#E8A04C");

  const assign = useMutation(api.tags.assignToContact);
  const unassign = useMutation(api.tags.unassignFromContact);
  const createTag = useMutation(api.tags.create);

  if (allTags === undefined || contactTags === undefined) {
    return <p className="text-sm text-muted">Loading…</p>;
  }

  const assignedIds = new Set<TagId>(contactTags.map((t) => t._id));

  const toggle = (tag: Tag) => {
    if (assignedIds.has(tag._id)) {
      unassign({ contactId, tagId: tag._id });
    } else {
      assign({ contactId, tagId: tag._id });
    }
  };

  const handleCreate = async () => {
    const name = newName.trim();
    if (!name) return;
    const tagId = await createTag({ name, color: newColor });
    await assign({ contactId, tagId });
    setNewName("");
    setCreating(false);
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {allTags.map((t) => (
        <TagBadge
          key={t._id}
          tag={t}
          active={assignedIds.has(t._id)}
          onClick={() => toggle(t)}
        />
      ))}
      {creating ? (
        <div className="flex items-center gap-2">
          <input
            autoFocus
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Tag name"
            aria-label="New tag name"
            className="input w-28 px-2 py-1 text-xs"
          />
          <input
            type="color"
            value={newColor}
            onChange={(e) => setNewColor(e.target.value)}
            aria-label="Tag color"
            className="h-7 w-7 cursor-pointer rounded border-0 bg-transparent p-0"
          />
          <button
            type="button"
            onClick={handleCreate}
            className="btn btn-primary btn-sm"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => setCreating(false)}
            className="btn btn-ghost btn-sm"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="chip hover:bg-sand/40 hover:text-ink-soft"
        >
          + New tag
        </button>
      )}
    </div>
  );
}
