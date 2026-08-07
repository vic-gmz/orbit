# 05 — Gamification

## Streak Engine

### Logic (in `convex/goals.ts`)

```
Called every time an interaction is created.

updateStreak(userId, interactionDate):
  today = startOfDay(interactionDate)
  goal = get goals for userId

  if goal.lastStreakDate is null:
    // First interaction ever
    goal.currentStreak = 1
    goal.longestStreak = 1
    goal.lastStreakDate = today

  else:
    daysSinceLast = (today - goal.lastStreakDate) / 86400000

    if daysSinceLast === 0:
      // Same day — no change to streak

    elif daysSinceLast === 1:
      // Consecutive day
      goal.currentStreak += 1
      goal.longestStreak = max(goal.longestStreak, goal.currentStreak)
      goal.lastStreakDate = today

    elif daysSinceLast > 1:
      // Streak broken
      goal.currentStreak = 1
      goal.lastStreakDate = today
```

### Visual Display

| Streak | Emoji | Label |
|---|---|---|
| 0 | — | "Start networking!" |
| 1–6 | 🔥 | "N días" |
| 7–29 | 🔥 | "N días — Consistent" |
| 30+ | 🔥 | "N días — Unstoppable!" |

## Levels

| Level | Threshold (total interactions) | Title | Emoji |
|---|---|---|---|
| 1 | 0 | Rookie | 🌱 |
| 2 | 5 | Bronze | 🥉 |
| 3 | 25 | Silver | 🥈 |
| 4 | 50 | Gold | 🥇 |
| 5 | 100 | Platinum | 💎 |
| 6 | 250 | Diamond | 👑 |

Calculated client-side from `totalInteractions` count (sum of all contacts' `interactionCount` or a dedicated query).

```typescript
function getLevel(totalInteractions: number): { level: number; title: string; emoji: string } {
  if (totalInteractions >= 250) return { level: 6, title: "Diamond", emoji: "👑" };
  if (totalInteractions >= 100) return { level: 5, title: "Platinum", emoji: "💎" };
  if (totalInteractions >= 50)  return { level: 4, title: "Gold", emoji: "🥇" };
  if (totalInteractions >= 25)  return { level: 3, title: "Silver", emoji: "🥈" };
  if (totalInteractions >= 5)   return { level: 2, title: "Bronze", emoji: "🥉" };
  return { level: 1, title: "Rookie", emoji: "🌱" };
}
```

## Achievements

| ID | Name | Condition | Toast Message |
|---|---|---|---|
| `first_contact` | First Contact | Log first interaction with any contact | "👋 First Contact — you reached out!" |
| `networker` | Networker | Reach 5 total interactions | "🤝 Networker — 5 interactions logged!" |
| `consistent` | Consistent | Reach 7-day streak | "🔥 Consistent — 7 day streak!" |
| `bridge_builder` | Bridge Builder | Have 5+ contacts at a single company | "🌉 Bridge Builder — 5 contacts at one company!" |
| `follow_up_champ` | Follow-up Champ | Complete 10 follow-ups | "📬 Follow-up Champ — 10 follow-ups done!" |
| `orbit_master` | Orbit Master | Reach 50 total interactions | "🌌 Orbit Master — 50 interactions!" |

### Detection Logic (in `convex/achievements.ts`)

Called after each interaction is created. Checks all achievements; returns only newly unlocked ones.

```typescript
async function checkAndUnlock(ctx, userId, contactId) {
  const newlyUnlocked: AchievementType[] = [];
  const existing = await ctx.db
    .query("achievements")
    .withIndex("by_user", (q) => q.eq("userId", userId))
    .collect();
  const existingTypes = new Set(existing.map((a) => a.type));

  const totalInteractions = await getTotalInteractions(ctx); // sum all contacts interactionCount
  const streak = (await getGoal(ctx, userId))?.currentStreak ?? 0;
  const completedFollowUps = await countCompletedFollowUps(ctx, userId);
  const maxContactsAtOneCompany = await getMaxContactsPerCompany(ctx);

  const checks: [AchievementType, boolean][] = [
    ["first_contact", totalInteractions >= 1],
    ["networker", totalInteractions >= 5],
    ["consistent", streak >= 7],
    ["bridge_builder", maxContactsAtOneCompany >= 5],
    ["follow_up_champ", completedFollowUps >= 10],
    ["orbit_master", totalInteractions >= 50],
  ];

  for (const [type, condition] of checks) {
    if (condition && !existingTypes.has(type)) {
      await ctx.db.insert("achievements", { userId, type, unlockedAt: Date.now() });
      newlyUnlocked.push(type);
    }
  }

  return newlyUnlocked;
}
```

## Weekly Goal

- Default: 2 interactions per week
- Configurable via `goals.setWeeklyGoal`
- Week is Monday to Sunday (ISO week)
- Progress = `count interactions where date is within this week / goal`
- Reset: automatic every Monday (the query filters by current week)

## Aura / Orbit Indicator

Around every contact avatar, a **complete** glowing SVG ring. All contacts get the ring and the same subtle glow animation; only the ring **color** varies with `interactionCount`:

| Interactions | Color | Hex |
|---|---|---|
| 0 | Gray | `#9CA3AF` |
| 1 | Blue | `#3B82F6` |
| 2–5 | Purple | `#8B5CF6` |
| 6–15 | Gold | `#F59E0B` |
| 16+ | Emerald | `#10B981` |

The ring is rendered as an SVG circle with `drop-shadow` glow animated via a `@keyframes aura-glow` pulse (defined in `src/index.css`, class `.aura-glow`). Color is set per contact via the `--aura-color` CSS variable.
