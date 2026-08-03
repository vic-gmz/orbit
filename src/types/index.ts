import type { Doc, Id } from "../../convex/_generated/dataModel";

export type Company = Doc<"companies">;
export type Contact = Doc<"contacts">;
export type Interaction = Doc<"interactions">;
export type Tag = Doc<"tags">;
export type ContactTag = Doc<"contactTags">;
export type Goal = Doc<"goals">;
export type Achievement = Doc<"achievements">;

export type InteractionType = Interaction["type"];
export type AchievementType = Achievement["type"];

export type CompanyId = Id<"companies">;
export type ContactId = Id<"contacts">;
export type InteractionId = Id<"interactions">;
export type TagId = Id<"tags">;

export type CompanyCreate = {
  name: string;
  website?: string;
  industry?: string;
  notes?: string;
  isTracked: boolean;
};

export type CompanyUpdate = Partial<CompanyCreate>;

export type ContactCreate = {
  name: string;
  email?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  role?: string;
  companyId?: Id<"companies">;
  personalProjects?: string;
  notes?: string;
};

export type ContactUpdate = Partial<ContactCreate>;

export type InteractionCreate = {
  contactId: Id<"contacts">;
  type: InteractionType;
  date: number;
  notes?: string;
  followUpDate?: number;
};

export type TagCreate = {
  name: string;
  color: string;
};

export type GrowthMonth = { month: string; count: number };
export type WeeklyCount = { weekStart: number; count: number };
export type WeeklyProgress = { current: number; goal: number };
export type PendingFollowUp = Interaction & { contact: Contact };
export type RecentInteraction = Interaction & { contact: Contact };
export type CreateInteractionResult = {
  interactionId: Id<"interactions">;
  newAchievements: AchievementType[];
};
