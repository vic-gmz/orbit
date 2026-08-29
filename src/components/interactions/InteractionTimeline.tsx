import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Interaction, InteractionId } from "../../types";
import InteractionItem from "./InteractionItem";

export default function InteractionTimeline({
  interactions,
}: {
  interactions: Interaction[];
}) {
  const markFollowUpDone = useMutation(api.interactions.markFollowUpDone);

  const sorted = [...interactions].sort((a, b) => b.date - a.date);

  return (
    <div className="flex flex-col gap-2.5">
      {sorted.length === 0 ? (
        <p className="text-sm text-muted">
          No interactions yet. Log your first one with the form above.
        </p>
      ) : (
        sorted.map((interaction) => (
          <InteractionItem
            key={interaction._id}
            interaction={interaction}
            onMarkDone={(id: InteractionId) =>
              markFollowUpDone({ id })
            }
          />
        ))
      )}
    </div>
  );
}
