import { query } from "./_generated/server";
import type { MutationCtx } from "./_generated/server";
import { v, type Infer } from "convex/values";
import { authComponent } from "./auth";

export const achievementValidator = v.union(
  v.literal("first_contact"),
  v.literal("networker"),
  v.literal("consistent"),
  v.literal("bridge_builder"),
  v.literal("follow_up_champ"),
  v.literal("orbit_master"),
);

export type AchievementType = Infer<typeof achievementValidator>;

export async function checkAndUnlock(
  ctx: MutationCtx,
  userId: string,
): Promise<AchievementType[]> {
  const existing = await ctx.db
    .query("achievements")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .collect();
  const existingTypes = new Set(existing.map((a) => a.type));

  const contacts = await ctx.db.query("contacts").collect();
  const totalInteractions = contacts.reduce(
    (sum, c) => sum + c.interactionCount,
    0,
  );

  const goal = await ctx.db
    .query("goals")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .first();
  const streak = goal?.currentStreak ?? 0;

  const interactions = await ctx.db.query("interactions").collect();
  const completedFollowUps = interactions.filter((i) => i.followUpDone).length;

  const companyCounts: Record<string, number> = {};
  for (const c of contacts) {
    if (c.companyId) {
      companyCounts[c.companyId] = (companyCounts[c.companyId] ?? 0) + 1;
    }
  }
  const maxContactsAtOneCompany = Object.values(companyCounts).reduce(
    (max, n) => Math.max(max, n),
    0,
  );

  const checks: [AchievementType, boolean][] = [
    ["first_contact", totalInteractions >= 1],
    ["networker", totalInteractions >= 5],
    ["consistent", streak >= 7],
    ["bridge_builder", maxContactsAtOneCompany >= 5],
    ["follow_up_champ", completedFollowUps >= 10],
    ["orbit_master", totalInteractions >= 50],
  ];

  const newlyUnlocked: AchievementType[] = [];
  for (const [type, condition] of checks) {
    if (condition && !existingTypes.has(type)) {
      await ctx.db.insert("achievements", {
        userId,
        type,
        unlockedAt: Date.now(),
      });
      newlyUnlocked.push(type);
    }
  }

  return newlyUnlocked;
}

export const list = query({
  args: {},
  handler: async (ctx) => {
    const auth = await authComponent.getAuthUser(ctx);
    return await ctx.db
      .query("achievements")
      .withIndex("by_user", (q) => q.eq("userId", auth._id))
      .collect();
  },
});
