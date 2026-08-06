import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {
    search: v.optional(v.string()),
    companyId: v.optional(v.id("companies")),
    tagId: v.optional(v.id("tags")),
  },
  handler: async (ctx, args) => {
    let contacts = await ctx.db.query("contacts").collect();

    if (args.companyId) {
      contacts = contacts.filter((c) => c.companyId === args.companyId);
    }

    if (args.tagId) {
      const contactTagRows = await ctx.db
        .query("contactTags")
        .withIndex("by_tag", (q) => q.eq("tagId", args.tagId!))
        .collect();
      const contactIds = new Set(contactTagRows.map((r) => r.contactId));
      contacts = contacts.filter((c) => contactIds.has(c._id));
    }

    if (args.search) {
      const q = args.search.toLowerCase();
      contacts = contacts.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          (c.role && c.role.toLowerCase().includes(q)),
      );
    }

    return contacts;
  },
});

export const get = query({
  args: { id: v.id("contacts") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getAvatarUrl = query({
  args: { storageId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const growthByMonth = query({
  args: {},
  handler: async (ctx) => {
    const contacts = await ctx.db.query("contacts").collect();
    const now = new Date();
    const months: { month: string; count: number }[] = [];

    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const count = contacts.filter((c) => {
        const cd = new Date(c.createdAt);
        return (
          cd.getFullYear() === d.getFullYear() && cd.getMonth() === d.getMonth()
        );
      }).length;
      months.push({ month: key, count });
    }

    return months;
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    email: v.optional(v.string()),
    linkedinUrl: v.optional(v.string()),
    githubUrl: v.optional(v.string()),
    role: v.optional(v.string()),
    companyId: v.optional(v.id("companies")),
    personalProjects: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("contacts", {
      ...args,
      interactionCount: 0,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("contacts"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    linkedinUrl: v.optional(v.string()),
    githubUrl: v.optional(v.string()),
    role: v.optional(v.string()),
    companyId: v.optional(v.id("companies")),
    personalProjects: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...fields } = args;
    const patch: Record<string, unknown> = { updatedAt: Date.now() };
    for (const [key, value] of Object.entries(fields)) {
      if (value !== undefined) patch[key] = value;
    }
    await ctx.db.patch(id, patch);
  },
});

export const remove = mutation({
  args: { id: v.id("contacts") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const setAvatar = mutation({
  args: { contactId: v.id("contacts"), storageId: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.contactId, {
      avatarStorageId: args.storageId,
      updatedAt: Date.now(),
    });
  },
});
