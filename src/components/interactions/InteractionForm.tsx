import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { AchievementType, ContactId, InteractionType } from "../../types";
import { fromDateInputValue, toDateInputValue } from "../../lib/format";
import {
  INTERACTION_TYPE_LABELS,
  INTERACTION_TYPES,
} from "../../lib/interactionTypes";

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
      className="card flex flex-col gap-3 p-4"
    >
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1">
          <label className="label" htmlFor="interaction-type">
            How did it go?
          </label>
          <select
            id="interaction-type"
            value={type}
            onChange={(e) => setType(e.target.value as InteractionType)}
            className="input w-auto"
          >
            {INTERACTION_TYPES.map((t) => (
              <option key={t} value={t}>
                {INTERACTION_TYPE_LABELS[t]}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="label" htmlFor="interaction-date">
            When
          </label>
          <input
            id="interaction-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input w-auto"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="label" htmlFor="followUpDate">
            Follow-up
          </label>
          <input
            id="followUpDate"
            type="date"
            value={followUpDate}
            onChange={(e) => setFollowUpDate(e.target.value)}
            className="input w-auto"
          />
        </div>
      </div>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="What happened?"
        aria-label="Notes"
        className="input resize-y"
        rows={2}
      />
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs text-muted">
          {followUpDate ? "With follow-up" : "No follow-up"}
        </span>
        <button type="submit" className="btn btn-primary btn-sm">
          Log interaction
        </button>
      </div>
    </form>
  );
}
