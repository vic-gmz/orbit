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
    <div className="card flex flex-col gap-1.5 p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-ink">
          {INTERACTION_TYPE_LABELS[interaction.type]}
        </span>
        <span
          className="text-xs text-muted"
          title={formatDate(interaction.date)}
        >
          {formatRelativeDate(interaction.date)}
        </span>
      </div>
      {interaction.notes && (
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink-soft">
          {interaction.notes}
        </p>
      )}
      {followUpPending ? (
        <div className="mt-1 flex items-center justify-between gap-3">
          <span className="chip border-sun-soft/70 bg-sun-soft/60 text-ink-soft">
            <span
              className="h-1.5 w-1.5 rounded-full bg-sun"
              aria-hidden="true"
            />
            Follow-up: {formatDate(interaction.followUpDate!)}
          </span>
          {onMarkDone && (
            <button
              type="button"
              onClick={() => onMarkDone(interaction._id)}
              className="btn btn-ghost btn-sm"
            >
              Mark done
            </button>
          )}
        </div>
      ) : (
        interaction.followUpDate && (
          <span className="chip bg-sage/15 text-ink-soft">
            <span
              className="h-1.5 w-1.5 rounded-full bg-sage"
              aria-hidden="true"
            />
            Follow-up: {formatDate(interaction.followUpDate)} (done)
          </span>
        )
      )}
    </div>
  );
}
