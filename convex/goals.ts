import { query, mutation } from "./_generated/server";
import type { MutationCtx } from "./_generated/server";
import { v } from "convex/values";
import { authComponent } from "./auth";

export function startOfDay(ts: number): number {
  const d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

export function startOfWeek(ts: number): number {
  const d = new Date(ts);
  const day = (d.getDay() + 6) % 7;
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - day);
  return d.getTime();
}

export async function getOrCreateGoal(ctx: MutationCtx, userId: string) {
  const existing = await ctx.db
    .query("goals")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .first();
  if (existing) return existing;

  const id = await ctx.db.insert("goals", {
    userId,
    weeklyInteractionGoal: 2,
    currentStreak: 0,
    longestStreak: 0,
    lastStreakDate: undefined,
    updatedAt: Date.now(),
  });
  return (await ctx.db.get(id))!;
}

export async function updateStreak(
  ctx: MutationCtx,
  userId: string,
  interactionDate: number,
) {
  const goal = await getOrCreateGoal(ctx, userId);
  const today = startOfDay(interactionDate);

  if (goal.lastStreakDate === undefined) {
    await ctx.db.patch(goal._id, {
      currentStreak: 1,
      longestStreak: Math.max(goal.longestStreak, 1),
      lastStreakDate: today,
      updatedAt: Date.now(),
    });
    return 1;
  }

  const daysSinceLast = Math.round(
    (today - goal.lastStreakDate) / 86400000,
  );

  if (daysSinceLast === 0) {
    return goal.currentStreak;
  } else if (daysSinceLast === 1) {
    const newStreak = goal.currentStreak + 1;
    await ctx.db.patch(goal._id, {
      currentStreak: newStreak,
      longestStreak: Math.max(goal.longestStreak, newStreak),
      lastStreakDate: today,
      updatedAt: Date.now(),
    });
    return newStreak;
  } else {
    await ctx.db.patch(goal._id, {
      currentStreak: 1,
      lastStreakDate: today,
      updatedAt: Date.now(),
    });
    return 1;
  }
}

export const setWeeklyGoal = mutation({
  args: { goal: v.number() },
  handler: async (ctx, args) => {
    const auth = await authComponent.getAuthUser(ctx);
    const goal = await getOrCreateGoal(ctx, auth._id);
    await ctx.db.patch(goal._id, {
      weeklyInteractionGoal: args.goal,
      updatedAt: Date.now(),
    });
  },
});

export const get = query({
  args: {},
  handler: async (ctx) => {
    const auth = await authComponent.getAuthUser(ctx);
    return await ctx.db
      .query("goals")
      .withIndex("by_user", (q) => q.eq("userId", auth._id))
      .first();
  },
});

export const weeklyProgress = query({
  args: {},
  handler: async (ctx) => {
    const auth = await authComponent.getAuthUser(ctx);

    const goal = await ctx.db
      .query("goals")
      .withIndex("by_user", (q) => q.eq("userId", auth._id))
      .first();

    const weekStart = startOfWeek(Date.now());
    const interactions = await ctx.db.query("interactions").collect();
    const current = interactions.filter((i) => i.date >= weekStart).length;

    return {
      current,
      goal: goal?.weeklyInteractionGoal ?? 2,
    };
  },
});
