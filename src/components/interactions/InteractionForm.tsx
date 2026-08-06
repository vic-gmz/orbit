import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { AchievementType, ContactId, InteractionType } from "../../types";
import { fromDateInputValue, toDateInputValue } from "../../lib/format";

const TYPES: InteractionType[] = [
  "chat",
  "virtual_coffee",
  "in_person",
  "call",
  "email",
  "event",
  "linkedin_dm",
];

const TYPE_LABELS: Record<InteractionType, string> = {
  chat: "Chat",
  virtual_coffee: "Virtual coffee",
  in_person: "In person",
  call: "Call",
  email: "Email",
  event: "Event",
  linkedin_dm: "LinkedIn DM",
};

export default function InteractionForm({
  contactId,
  onCreated,
}: {
  contactId: ContactId;
  onCreated?: (newAchievements: AchievementType[]) => void;
}) {
  const [type, setType] = useState<InteractionType>("chat");
  const [date, setDate] = useState(() => toDateInputValue(Date.now()));
  const [notes, setNotes] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");

  const createInteraction = useMutation(api.interactions.create);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;
    const result = await createInteraction({
      contactId,
      type,
      date: fromDateInputValue(date),
      notes: notes.trim() || undefined,
      followUpDate: followUpDate ? fromDateInputValue(followUpDate) : undefined,
    });
    setType("chat");
    setNotes("");
    setFollowUpDate("");
    setDate(toDateInputValue(Date.now()));
    onCreated?.(result.newAchievements);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 rounded border p-3"
    >
      <div className="flex flex-wrap gap-2">
        <select
          value={type}
          onChange={(e) => setType(e.target.value as InteractionType)}
          className="rounded border px-2 py-1 text-sm"
        >
          {TYPES.map((t) => (
            <option key={t} value={t}>
              {TYPE_LABELS[t]}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded border px-2 py-1 text-sm"
        />
        <label htmlFor="followUpDate">Follow-up</label>
        <input
          id="followUpDate"
          type="date"
          value={followUpDate}
          onChange={(e) => setFollowUpDate(e.target.value)}
          className="rounded border px-2 py-1 text-sm"
          placeholder="Follow-up"
        />
      </div>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="What happened?"
        className="rounded border p-2 text-sm"
        rows={2}
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">
          {followUpDate ? "With follow-up" : "No follow-up"}
        </span>
        <button type="submit" className="rounded border px-3 py-1 text-sm">
          Log interaction
        </button>
      </div>
    </form>
  );
}
