import type { InteractionType } from "../types";

export const INTERACTION_TYPES: InteractionType[] = [
  "chat",
  "virtual_coffee",
  "in_person",
  "call",
  "email",
  "event",
  "linkedin_dm",
];

export const INTERACTION_TYPE_LABELS: Record<InteractionType, string> = {
  chat: "Chat",
  virtual_coffee: "Virtual coffee",
  in_person: "In person",
  call: "Call",
  email: "Email",
  event: "Event",
  linkedin_dm: "LinkedIn DM",
};
