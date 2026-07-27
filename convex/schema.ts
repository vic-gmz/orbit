import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  companies: defineTable({
    name: v.string(),
    website: v.optional(v.string()),
    industry: v.optional(v.string()),
    notes: v.optional(v.string()),
    isTracked: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_name", ["name"])
    .index("by_tracked", ["isTracked"]),

  contacts: defineTable({
    name: v.string(),
    email: v.optional(v.string()),
    linkedinUrl: v.optional(v.string()),
    githubUrl: v.optional(v.string()),
    role: v.optional(v.string()),
    companyId: v.optional(v.id("companies")),
    personalProjects: v.optional(v.string()),
    notes: v.optional(v.string()),
    avatarStorageId: v.optional(v.string()),
    interactionCount: v.number(),
    lastInteractionAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_name", ["name"])
    .index("by_company", ["companyId"])
    .index("by_last_interaction", ["lastInteractionAt"]),

  interactions: defineTable({
    contactId: v.id("contacts"),
    type: v.union(
      v.literal("chat"),
      v.literal("virtual_coffee"),
      v.literal("in_person"),
      v.literal("call"),
      v.literal("email"),
      v.literal("event"),
      v.literal("linkedin_dm"),
    ),
    date: v.number(),
    notes: v.optional(v.string()),
    followUpDate: v.optional(v.number()),
    followUpDone: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_contact", ["contactId"])
    .index("by_date", ["date"])
    .index("by_follow_up", ["followUpDate", "followUpDone"]),

  tags: defineTable({
    name: v.string(),
    color: v.string(),
    createdAt: v.number(),
  })
    .index("by_name", ["name"]),

  contactTags: defineTable({
    contactId: v.id("contacts"),
    tagId: v.id("tags"),
  })
    .index("by_contact", ["contactId"])
    .index("by_tag", ["tagId"]),

  goals: defineTable({
    userId: v.string(),
    weeklyInteractionGoal: v.number(),
    currentStreak: v.number(),
    longestStreak: v.number(),
    lastStreakDate: v.optional(v.number()),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"]),

  achievements: defineTable({
    userId: v.string(),
    type: v.union(
      v.literal("first_contact"),
      v.literal("networker"),
      v.literal("consistent"),
      v.literal("bridge_builder"),
      v.literal("follow_up_champ"),
      v.literal("orbit_master"),
    ),
    unlockedAt: v.number(),
  })
    .index("by_user", ["userId"]),
});
