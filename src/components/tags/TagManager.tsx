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
  const [newColor, setNewColor] = useState("#3B82F6");

  const assign = useMutation(api.tags.assignToContact);
  const unassign = useMutation(api.tags.unassignFromContact);
  const createTag = useMutation(api.tags.create);

  if (allTags === undefined || contactTags === undefined) {
    return <p className="text-sm text-gray-500">Loading...</p>;
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
    <div className="flex flex-wrap items-center gap-1">
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
            className="w-28 rounded border px-2 py-1 text-xs"
          />
          <input
            type="color"
            value={newColor}
            onChange={(e) => setNewColor(e.target.value)}
            className="h-6 w-6 cursor-pointer"
          />
          <button
            type="button"
            onClick={handleCreate}
            className="rounded border px-2 py-1 text-xs"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => setCreating(false)}
            className="rounded border px-2 py-1 text-xs text-gray-500"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="rounded-full border px-2 py-1 text-xs text-gray-500"
        >
          + New tag
        </button>
      )}
    </div>
  );
}
