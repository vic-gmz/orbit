import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { authComponent } from "./auth";
import { updateStreak, startOfWeek } from "./goals";
import { checkAndUnlock, achievementValidator } from "./achievements";

export const create = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const auth = await authComponent.getAuthUser(ctx);

    const contact = await ctx.db.get(args.contactId);
    if (!contact) throw new Error("Contact not found");

    const interactionId = await ctx.db.insert("interactions", {
      contactId: args.contactId,
      type: args.type,
      date: args.date,
      notes: args.notes,
      followUpDate: args.followUpDate,
      followUpDone: false,
      createdAt: Date.now(),
    });

    await ctx.db.patch(args.contactId, {
      interactionCount: contact.interactionCount + 1,
      lastInteractionAt: args.date,
      updatedAt: Date.now(),
    });

    await updateStreak(ctx, auth._id, args.date);
    const newAchievements = await checkAndUnlock(ctx, auth._id);

    return { interactionId, newAchievements };
  },
  returns: v.object({
    interactionId: v.id("interactions"),
    newAchievements: v.array(achievementValidator),
  }),
});

export const markFollowUpDone = mutation({
  args: { id: v.id("interactions") },
  handler: async (ctx, args) => {
    const auth = await authComponent.getAuthUser(ctx);

    const interaction = await ctx.db.get(args.id);
    if (!interaction) throw new Error("Interaction not found");

    await ctx.db.patch(args.id, { followUpDone: true });
    await checkAndUnlock(ctx, auth._id);
  },
});

export const listByContact = query({
  args: { contactId: v.id("contacts") },
  handler: async (ctx, args) => {
    const rows = await ctx.db
      .query("interactions")
      .withIndex("by_contact", (q) => q.eq("contactId", args.contactId))
      .collect();
    return rows.sort((a, b) => b.date - a.date);
  },
});

export const pendingFollowUps = query({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const rows = await ctx.db
      .query("interactions")
      .withIndex("by_follow_up", (q) => q.lte("followUpDate", now))
      .collect();
    const pending = rows
      .filter((i) => !i.followUpDone)
      .sort((a, b) => (a.followUpDate ?? 0) - (b.followUpDate ?? 0));

    const withContacts = await Promise.all(
      pending.map(async (i) => {
        const contact = await ctx.db.get(i.contactId);
        return contact ? { ...i, contact } : null;
      }),
    );
    return withContacts.filter((x) => x !== null);
  },
});

export const weeklyCounts = query({
  args: { weeks: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const numWeeks = args.weeks ?? 12;
    const interactions = await ctx.db.query("interactions").collect();
    const now = Date.now();
    const result: { weekStart: number; count: number }[] = [];

    for (let i = numWeeks - 1; i >= 0; i--) {
      const ts = now - i * 7 * 86400000;
      const weekStart = startOfWeek(ts);
      const weekEnd = weekStart + 7 * 86400000;
      const count = interactions.filter(
        (ix) => ix.date >= weekStart && ix.date < weekEnd,
      ).length;
      result.push({ weekStart, count });
    }

    return result;
  },
});

export const recent = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const rows = await ctx.db.query("interactions").collect();
    const sorted = rows.sort((a, b) => b.date - a.date).slice(0, args.limit ?? 5);
    const withContacts = await Promise.all(
      sorted.map(async (i) => {
        const contact = await ctx.db.get(i.contactId);
        return contact ? { ...i, contact } : null;
      }),
    );
    return withContacts.filter((x) => x !== null);
  },
});
