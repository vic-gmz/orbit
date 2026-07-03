# 03 — API (Convex Functions)

## File: `convex/companies.ts`

### Mutations

```typescript
// Create a company
export const create = mutation({
  args: { name: v.string(), website: v.optional(v.string()), industry: v.optional(v.string()), notes: v.optional(v.string()), isTracked: v.boolean() },
  handler: async (ctx, args) => { /* ... */ },
  returns: v.id("companies"),
})

// Update a company
export const update = mutation({
  args: { id: v.id("companies"), name: v.optional(v.string()), website: v.optional(v.string()), industry: v.optional(v.string()), notes: v.optional(v.string()), isTracked: v.optional(v.boolean()) },
  handler: async (ctx, args) => { /* ... */ },
})

// Delete a company
export const remove = mutation({
  args: { id: v.id("companies") },
  handler: async (ctx, args) => { /* ... */ },
})

// Toggle tracked status (convenience)
export const toggleTracked = mutation({
  args: { id: v.id("companies") },
  handler: async (ctx, args) => { /* ... */ },
})
```

### Queries

```typescript
// Get all companies, optionally filtered by tracked
export const list = query({
  args: { trackedOnly: v.optional(v.boolean()) },
  handler: async (ctx, args) => { /* ... */ },
  returns: v.array(/* Company Doc */),
})

// Get single company
export const get = query({
  args: { id: v.id("companies") },
  handler: async (ctx, args) => { /* ... */ },
  returns: v.union(/* Company Doc */, v.null()),
})

// Get contacts for a company
export const getContacts = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args) => { /* ... */ },
  returns: v.array(/* Contact Doc */),
})
```

## File: `convex/contacts.ts`

### Mutations

```typescript
export const create = mutation({
  args: { name: v.string(), email: v.optional(v.string()), linkedinUrl: v.optional(v.string()), githubUrl: v.optional(v.string()), role: v.optional(v.string()), companyId: v.optional(v.id("companies")), personalProjects: v.optional(v.string()), notes: v.optional(v.string()) },
  handler: async (ctx, args) => { /* ... */ },
  returns: v.id("contacts"),
})

export const update = mutation({
  args: { id: v.id("contacts"), ...partial fields },
  handler: async (ctx, args) => { /* ... */ },
})

export const remove = mutation({
  args: { id: v.id("contacts") },
  handler: async (ctx, args) => { /* ... */ },
})

// Upload avatar — frontend calls generateUploadUrl, then uploads file, then calls this
export const setAvatar = mutation({
  args: { contactId: v.id("contacts"), storageId: v.string() },
  handler: async (ctx, args) => { /* ... */ },
})
```

### Queries

```typescript
export const list = query({
  args: { search: v.optional(v.string()), companyId: v.optional(v.id("companies")), tagId: v.optional(v.id("tags")) },
  handler: async (ctx, args) => { /* ... */ },
  returns: v.array(/* Contact Doc */),
})

export const get = query({
  args: { id: v.id("contacts") },
  handler: async (ctx, args) => { /* ... */ },
  returns: v.union(/* Contact Doc */, v.null()),
})

export const getAvatarUrl = query({
  args: { storageId: v.string() },
  handler: async (ctx, args) => { /* ... */ },
  returns: v.union(v.string(), v.null()),
})

// For growth chart — count by month
export const growthByMonth = query({
  args: {},
  handler: async (ctx) => { /* returns array of { month: string, count: number } */ },
})
```

## File: `convex/interactions.ts`

### Mutations

```typescript
export const create = mutation({
  args: {
    contactId: v.id("contacts"),
    type: interactionTypes,
    date: v.number(),
    notes: v.optional(v.string()),
    followUpDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // 1. Insert interaction
    // 2. Update contact.interactionCount += 1
    // 3. Update contact.lastInteractionAt = date
    // 4. Run streak check (goals.ts)
    // 5. Run achievement check (achievements.ts)
    // Return interactionId + any newly unlocked achievements
  },
  returns: v.object({ interactionId: v.id("interactions"), newAchievements: v.array(achievementTypes) }),
})

export const markFollowUpDone = mutation({
  args: { id: v.id("interactions") },
  handler: async (ctx, args) => { /* ... */ },
})
```

### Queries

```typescript
export const listByContact = query({
  args: { contactId: v.id("contacts") },
  handler: async (ctx, args) => { /* ... */ },
  returns: v.array(/* Interaction Doc */),
})

export const pendingFollowUps = query({
  args: {},
  handler: async (ctx, args) => {
    // Returns interactions where followUpDate <= now AND followUpDone === false
  },
  returns: v.array(/* Interaction Doc with contact info */),
})

// For weekly chart
export const weeklyCounts = query({
  args: { weeks: v.optional(v.number()) }, // default 12
  handler: async (ctx, args) => { /* ... */ },
  returns: v.array(/* { weekStart: number, count: number } */),
})
```

## File: `convex/tags.ts`

### Mutations

```typescript
export const create = mutation({
  args: { name: v.string(), color: v.string() },
  handler: async (ctx, args) => { /* ... */ },
  returns: v.id("tags"),
})

export const remove = mutation({
  args: { id: v.id("tags") },
  handler: async (ctx, args) => { /* ... */ },
})

export const assignToContact = mutation({
  args: { contactId: v.id("contacts"), tagId: v.id("tags") },
  handler: async (ctx, args) => { /* ... */ },
})

export const unassignFromContact = mutation({
  args: { contactId: v.id("contacts"), tagId: v.id("tags") },
  handler: async (ctx, args) => { /* ... */ },
})
```

### Queries

```typescript
export const list = query({
  args: {},
  handler: async (ctx, args) => { /* ... */ },
  returns: v.array(/* Tag Doc */),
})

export const listByContact = query({
  args: { contactId: v.id("contacts") },
  handler: async (ctx, args) => { /* ... */ },
  returns: v.array(/* Tag Doc */),
})
```

## File: `convex/goals.ts`

### Mutations

```typescript
export const setWeeklyGoal = mutation({
  args: { goal: v.number() },
  handler: async (ctx, args) => { /* upsert goals row */ },
})

// Called internally by interactions.create — not exported as API
// internal: updateStreak(ctx, userId, today)
// - If today > lastStreakDate + 1 day, reset streak to 1
// - If today === lastStreakDate, no change
// - If today > lastStreakDate, increment streak
```

### Queries

```typescript
export const get = query({
  args: {},
  handler: async (ctx, args) => { /* ... */ },
  returns: v.union(/* Goal Doc */, v.null()),
})

export const weeklyProgress = query({
  args: {},
  handler: async (ctx, args) => {
    // Count interactions this week (Mon–Sun)
    // Return { current: number, goal: number }
  },
  returns: v.object({ current: v.number(), goal: v.number() }),
})
```

## File: `convex/achievements.ts`

### Mutations

```typescript
// Called internally by interactions.create
// internal: checkAndUnlock(ctx, userId, contactId, interactionCount)
// Checks each achievement condition and unlocks if newly met.
// Returns array of newly unlocked achievement types.

// Conditions:
// first_contact  → interactionCount === 1
// networker      → interactionCount === 5
// consistent     → currentStreak >= 7
// bridge_builder → count contacts in same company >= 5
// follow_up_champ→ completed follow-ups >= 10
// orbit_master   → total interactions >= 50
```

### Queries

```typescript
export const list = query({
  args: {},
  handler: async (ctx, args) => { /* ... */ },
  returns: v.array(/* Achievement Doc with type info */),
})
```
