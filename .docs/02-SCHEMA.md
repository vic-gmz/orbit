# 02 — Schema (Convex)

## Table: `companies`

```typescript
// convex/schema.ts
export const companies = defineTable({
  name: v.string(),               // Company name
  website: v.optional(v.string()),
  industry: v.optional(v.string()),
  notes: v.optional(v.string()),
  isTracked: v.boolean(),         // User is interested in this company
  createdAt: v.number(),          // Date.now()
  updatedAt: v.number(),
})
.index("by_name", ["name"])
.index("by_tracked", ["isTracked"])
```

## Table: `contacts`

```typescript
export const contacts = defineTable({
  name: v.string(),
  email: v.optional(v.string()),
  linkedinUrl: v.optional(v.string()),
  githubUrl: v.optional(v.string()),
  role: v.optional(v.string()),          // Job title / role
  companyId: v.optional(v.id("companies")),
  personalProjects: v.optional(v.string()),
  notes: v.optional(v.string()),
  avatarStorageId: v.optional(v.string()), // Convex file storage ID
  interactionCount: v.number(),            // Total interactions (cached for aura)
  lastInteractionAt: v.optional(v.number()), // Date.now() of most recent
  createdAt: v.number(),
  updatedAt: v.number(),
})
.index("by_name", ["name"])
.index("by_company", ["companyId"])
.index("by_last_interaction", ["lastInteractionAt"])
```

## Table: `interactions`

```typescript
export const interactionTypes = v.union(
  v.literal("chat"),
  v.literal("virtual_coffee"),
  v.literal("in_person"),
  v.literal("call"),
  v.literal("email"),
  v.literal("event"),
  v.literal("linkedin_dm"),
)

export const interactions = defineTable({
  contactId: v.id("contacts"),
  type: interactionTypes,
  date: v.number(),               // Date.now() of when it happened
  notes: v.optional(v.string()),
  followUpDate: v.optional(v.number()), // When to follow up
  followUpDone: v.boolean(),           // Follow-up completed
  createdAt: v.number(),
})
.index("by_contact", ["contactId"])
.index("by_date", ["date"])
.index("by_follow_up", ["followUpDate", "followUpDone"])
```

## Table: `tags`

```typescript
export const tags = defineTable({
  name: v.string(),
  color: v.string(),    // Hex color, e.g. "#3B82F6"
  createdAt: v.number(),
})
.index("by_name", ["name"])
```

## Table: `contactTags`

```typescript
export const contactTags = defineTable({
  contactId: v.id("contacts"),
  tagId: v.id("tags"),
})
.index("by_contact", ["contactId"])
.index("by_tag", ["tagId"])
```

## Table: `goals`

One row per user (singleton pattern).

```typescript
export const goals = defineTable({
  userId: v.string(),                // auth user ID
  weeklyInteractionGoal: v.number(), // default 2
  currentStreak: v.number(),         // consecutive days with >=1 interaction
  longestStreak: v.number(),
  lastStreakDate: v.optional(v.number()), // last date that counted toward streak
  updatedAt: v.number(),
})
.index("by_user", ["userId"])
```

## Table: `achievements`

```typescript
export const achievementTypes = v.union(
  v.literal("first_contact"),
  v.literal("networker"),
  v.literal("consistent"),
  v.literal("bridge_builder"),
  v.literal("follow_up_champ"),
  v.literal("orbit_master"),
)

export const achievements = defineTable({
  userId: v.string(),
  type: achievementTypes,
  unlockedAt: v.number(),
})
.index("by_user", ["userId"])
```

## TypeScript Types (mirror)

```typescript
// src/types/index.ts
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

export type CompanyCreate = Omit<Company, "_id" | "_creationTime" | "createdAt" | "updatedAt">;
export type ContactCreate = Omit<Contact, "_id" | "_creationTime" | "createdAt" | "updatedAt" | "interactionCount" | "lastInteractionAt">;
export type InteractionCreate = Omit<Interaction, "_id" | "_creationTime" | "createdAt">;
```

## Relationships Diagram

```
companies ──< contacts ──< interactions
                │
                └──< contactTags >── tags

goals (1 per user)
achievements (N per user)
```
