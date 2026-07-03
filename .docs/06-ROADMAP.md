# 06 — Roadmap

> Each phase must be completed in order. Within a phase, tasks are sequential unless marked "parallel."

---

## Phase 1: Schema + Backend (Convex)

### 1.1 — Define schema
- **Files**: `convex/schema.ts`
- **Action**: Define all 7 tables with validators, indexes, and relations
- **Success**: `npx convex dev` compiles without errors

### 1.2 — Companies CRUD (parallel with 1.3)
- **Files**: `convex/companies.ts`
- **Actions**:
  - `list` query (with optional `trackedOnly` filter)
  - `get` query
  - `create` mutation
  - `update` mutation
  - `remove` mutation
  - `toggleTracked` mutation
  - `getContacts` query (list contacts at company)
- **Success**: All functions exported and type-safe

### 1.3 — Contacts CRUD (parallel with 1.2)
- **Files**: `convex/contacts.ts`
- **Actions**:
  - `list` query (with optional search, companyId, tagId filters)
  - `get` query
  - `create` mutation
  - `update` mutation
  - `remove` mutation
  - `setAvatar` mutation
  - `getAvatarUrl` query
  - `growthByMonth` query (for growth chart)
- **Success**: All functions exported and type-safe

### 1.4 — Tags CRUD
- **Files**: `convex/tags.ts`
- **Actions**:
  - `list` query
  - `create` mutation
  - `remove` mutation
  - `assignToContact` mutation
  - `unassignFromContact` mutation
  - `listByContact` query
- **Success**: All functions exported and type-safe

### 1.5 — Interactions + Goals + Achievements
- **Files**: `convex/interactions.ts`, `convex/goals.ts`, `convex/achievements.ts`
- **Actions**:
  - `interactions.create` — main mutation, updates contact counters, triggers streak + achievement checks
  - `interactions.listByContact` query
  - `interactions.pendingFollowUps` query
  - `interactions.markFollowUpDone` mutation
  - `interactions.weeklyCounts` query
  - `goals.setWeeklyGoal` mutation
  - `goals.get` query
  - `goals.weeklyProgress` query
  - `achievements.list` query
  - Internal streak engine (in goals.ts)
  - Internal achievement detection (in achievements.ts)
- **Success**: Creating an interaction updates contact counters, streak, and unlocks achievements

### 1.6 — Shared types
- **Files**: `src/types/index.ts`
- **Action**: Re-export Convex Doc types + create input types
- **Success**: Types compile without errors

---

## Phase 2: Frontend Core

### 2.1 — Router + Layout + AuthGuard
- **Files**: `src/App.tsx`, `src/components/layout/Layout.tsx`, `src/components/layout/Sidebar.tsx`, `src/components/auth/AuthGuard.tsx`
- **Dependencies**: Phase 1 complete
- **Actions**:
  - Install `react-router-dom`
  - Create `<AuthGuard>` using `useConvexAuth()` — shows `<AuthForm />` if not authenticated
  - Create `<Layout>` with sidebar + content area
  - Create `<Sidebar>` with nav links
  - Set up router in `App.tsx` with all routes (all pages can be placeholder initially)
- **Success**: Navigation works, auth gates work

### 2.2 — Companies pages
- **Files**: `src/components/companies/CompaniesPage.tsx`, `src/components/companies/CompanyForm.tsx`, `src/components/companies/CompanyDetail.tsx`
- **Dependencies**: 2.1
- **Actions**:
  - Company list with search + tracked filter
  - Create/edit form
  - Detail page with contact list
  - Empty state: "No companies yet"
- **Success**: Can create, edit, delete, and view companies

### 2.3 — Contacts pages
- **Files**: `src/components/contacts/ContactsPage.tsx`, `src/components/contacts/ContactForm.tsx`, `src/components/contacts/ContactCard.tsx`, `src/components/contacts/ContactDetail.tsx`
- **Dependencies**: 2.1, 2.2
- **Actions**:
  - Contact list with search + filters (by company, by tag)
  - ContactCard with avatar (initials fallback), name, role, company, last interaction
  - Create/edit form with avatar upload
  - Detail page with profile + tags + interactions
  - Empty state: "No contacts yet"
- **Success**: Can create, edit, delete, and view contacts with avatar upload

### 2.4 — Tags UI
- **Files**: `src/components/tags/TagManager.tsx`, `src/components/tags/TagBadge.tsx`
- **Dependencies**: 2.3
- **Actions**:
  - TagManager component for ContactDetail
  - Create tags inline (name + color)
  - Assign/unassign from contact
- **Success**: Tags can be created and assigned to contacts

### 2.5 — Interactions UI
- **Files**: `src/components/interactions/InteractionForm.tsx`, `src/components/interactions/InteractionTimeline.tsx`, `src/components/interactions/InteractionItem.tsx`
- **Dependencies**: all backend complete
- **Actions**:
  - InteractionForm embedded in ContactDetail
  - InteractionTimeline showing all interactions for a contact
  - Follow-up marking
- **Success**: Can log interactions and see timeline per contact

---

## Phase 3: Dashboard + Stats

### 3.1 — Dashboard page
- **Files**: `src/components/dashboard/DashboardPage.tsx`, `src/components/dashboard/WeeklyGoalWidget.tsx`, `src/components/dashboard/StreakDisplay.tsx`, `src/components/dashboard/RecentInteractions.tsx`, `src/components/dashboard/PendingFollowUps.tsx`
- **Dependencies**: all of Phase 2
- **Actions**:
  - WeeklyGoalWidget with progress bar + goal setter
  - StreakDisplay with current + longest
  - RecentInteractions (last 5)
  - PendingFollowUps with "mark done" buttons
  - Empty state when no data
- **Success**: Dashboard shows real data from Convex queries

### 3.2 — Stats page
- **Files**: `src/components/stats/StatsPage.tsx`, `src/components/stats/GrowthChart.tsx`, `src/components/stats/WeeklyChart.tsx`, `src/components/stats/BadgeGrid.tsx`, `src/components/stats/StreakHistory.tsx`
- **Dependencies**: 3.1 (not strictly, but same data)
- **Actions**:
  - Install Recharts
  - GrowthChart (LineChart — contacts over time)
  - WeeklyChart (BarChart — interactions per week)
  - BadgeGrid (all achievements)
  - StreakHistory (current + longest + best week)
  - Summary cards (total contacts, total ints, streak, tracked companies)
- **Success**: Charts render with real data, badges show locked/unlocked

### 3.3 — Gamification frontend
- **Files**: `src/hooks/useStreak.ts`, `src/hooks/useAchievements.ts`, updates to `DashboardPage.tsx`
- **Dependencies**: 3.1, 3.2
- **Actions**:
  - Achievement toast notification system (returned from interaction creation)
  - Sidebar shows level + streak
  - Badge unlock flow: mutation returns new achievements → toast appears
- **Success**: Toast appears when achievement is unlocked

---

## Phase 4: Polish + Edge Cases

### 4.1 — Aura/orbit indicator on ContactCard
- **Actions**: Add SVG ring around avatar based on interactionCount thresholds
- **Files**: `src/components/contacts/ContactCard.tsx`
- **Success**: Visual ring appears with correct color

### 4.2 — Empty states across all pages
- **Actions**: Add friendly empty state messages with links to create first item
- **Files**: All list/detail pages
- **Success**: Every page handles empty/loading/error states

### 4.3 — Follow-up badge in sidebar
- **Actions**: Sidebar shows pending count badge, Dashboard highlights overdue items
- **Files**: `src/components/layout/Sidebar.tsx`
- **Success**: Badge updates reactively

### 4.4 — Final QA
- **Actions**:
  - Verify all CRUD operations work
  - Verify streak calculation correct
  - Verify achievement unlock flow
  - Verify file upload + avatar display
  - Test empty states
- **Success**: All features function without errors
