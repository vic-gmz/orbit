import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tags").collect();
  },
});

export const listByContact = query({
  args: { contactId: v.id("contacts") },
  handler: async (ctx, args) => {
    const contactTagRows = await ctx.db
      .query("contactTags")
      .withIndex("by_contact", (q) => q.eq("contactId", args.contactId))
      .collect();
    const tags = await Promise.all(
      contactTagRows.map((row) => ctx.db.get(row.tagId)),
    );
    return tags.filter((tag) => tag !== null);
  },
});

export const create = mutation({
  args: { name: v.string(), color: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.insert("tags", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("tags") },
  handler: async (ctx, args) => {
    const contactTagRows = await ctx.db
      .query("contactTags")
      .withIndex("by_tag", (q) => q.eq("tagId", args.id))
      .collect();
    for (const row of contactTagRows) {
      await ctx.db.delete(row._id);
    }
    await ctx.db.delete(args.id);
  },
});

export const assignToContact = mutation({
  args: { contactId: v.id("contacts"), tagId: v.id("tags") },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("contactTags")
      .withIndex("by_contact", (q) => q.eq("contactId", args.contactId))
      .collect();
    const alreadyAssigned = existing.some((row) => row.tagId === args.tagId);
    if (!alreadyAssigned) {
      await ctx.db.insert("contactTags", args);
    }
  },
});

export const unassignFromContact = mutation({
  args: { contactId: v.id("contacts"), tagId: v.id("tags") },
  handler: async (ctx, args) => {
    const rows = await ctx.db
      .query("contactTags")
      .withIndex("by_contact", (q) => q.eq("contactId", args.contactId))
      .collect();
    const match = rows.find((row) => row.tagId === args.tagId);
    if (match) {
      await ctx.db.delete(match._id);
    }
  },
});
