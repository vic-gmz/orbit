import type { Interaction, InteractionId } from "../../types";
import { formatDate, formatRelativeDate } from "../../lib/format";
import { INTERACTION_TYPE_LABELS } from "../../lib/interactionTypes";

export default function InteractionItem({
  interaction,
  onMarkDone,
}: {
  interaction: Interaction;
  onMarkDone?: (id: InteractionId) => void;
}) {
  const followUpPending =
    interaction.followUpDate && !interaction.followUpDone;

  return (
    <div className="flex flex-col gap-1 rounded border p-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">
          {INTERACTION_TYPE_LABELS[interaction.type]}
        </span>
        <span
          className="text-xs text-gray-500"
          title={formatDate(interaction.date)}
        >
          {formatRelativeDate(interaction.date)}
        </span>
      </div>
      {interaction.notes && (
        <p className="whitespace-pre-wrap text-sm">{interaction.notes}</p>
      )}
      {followUpPending ? (
        <div className="flex items-center justify-between">
          <span className="text-xs text-amber-700">
            Follow-up: {formatDate(interaction.followUpDate!)}
          </span>
          {onMarkDone && (
            <button
              type="button"
              onClick={() => onMarkDone(interaction._id)}
              className="rounded border px-2 py-1 text-xs"
            >
              Mark done
            </button>
          )}
        </div>
      ) : (
        interaction.followUpDate && (
          <span className="text-xs text-gray-500">
            Follow-up: {formatDate(interaction.followUpDate)} (done)
          </span>
        )
      )}
    </div>
  );
}
