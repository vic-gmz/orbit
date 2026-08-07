# 04 — Components

## Routing

```
/             → <DashboardPage />
/companies    → <CompaniesPage />
/companies/new → <CompanyForm />
/companies/:id → <CompanyDetail />
/contacts     → <ContactsPage />
/contacts/new → <ContactForm />
/contacts/:id → <ContactDetail />
/stats        → <StatsPage />
```

All routes wrapped in `<AuthGuard>` which checks `useConvexAuth()` and redirects to `<AuthForm>` if not authenticated.

## Component Tree

```
<App>
  <AuthGuard>
    <Layout>
      <Sidebar />
      <main>
        <Outlet />  ← react-router
      </main>
    </Layout>
  </AuthGuard>
</App>
```

## Component Specs

### `<Layout>`
- Renders `<Sidebar>` + `<Outlet />` side by side
- Manages follow-up badge count (passed to Sidebar)

### `<Sidebar>`
- Links: Dashboard, Companies, Contacts, Stats
- Shows current streak (🔥 N días) from `useStreak()`
- Shows current level from `useAchievements()`
- Shows pending follow-ups badge count from `useQuery(api.interactions.pendingFollowUps)`

### `<DashboardPage>`
- **Data**: `useQuery(api.goals.weeklyProgress)`, `useQuery(api.goals.get)`, `useQuery(api.interactions.pendingFollowUps)`, `useQuery(api.interactions.recent)`
- Renders: `<WeeklyGoalWidget>`, `<StreakDisplay>`, `<RecentInteractions>`, `<PendingFollowUps>`, `<GrowthChart>`

### `<WeeklyGoalWidget>`
- Shows progress bar: `current / goal`
- Button to change goal → calls `useMutation(api.goals.setWeeklyGoal)`

### `<StreakDisplay>`
- Shows current streak number with fire emoji
- Shows longest streak below

### `<RecentInteractions>`
- List of last 5 interactions with contact name, type, relative date

### `<PendingFollowUps>`
- List of overdue + upcoming follow-ups
- Each: contact name, type, date, notes snippet, "Mark done" button
- "Mark done" calls `useMutation(api.interactions.markFollowUpDone)`

### `<CompaniesPage>`
- **Data**: `useQuery(api.companies.list)`
- Search input (client-side filter by name)
- Toggle filter: "tracked only"
- List of company cards
- Each card: name, industry, contact count, isTracked toggle
- Click → navigate to `/companies/:id`
- "+" FAB → navigate to `/companies/new`

### `<CompanyForm>`
- Create/edit form
- Fields: name (required), website, industry, notes, isTracked
- On submit: `useMutation(api.companies.create)` or `api.companies.update`
- Redirects to company list/detail on success

### `<CompanyDetail>`
- **Data**: `useQuery(api.companies.get, { id })` + `useQuery(api.companies.getContacts, { companyId })`
- Shows company info + edit button
- Lists contacts working there (reuses `<ContactCard>`) with "Add contact at this company" button → navigate to `/contacts/new?companyId=...`

### `<ContactsPage>`
- **Data**: `useQuery(api.contacts.list)`
- Search input (filters by name, role, company)
- Filter by tag (dropdown)
- Filter by company (dropdown)
- Grid/list of `<ContactCard>` components
- Click card → navigate to `/contacts/:id`

### `<ContactCard>`
- Props: `contact: Contact`
- Shows: avatar (or initials), name, role, company name, last interaction relative date
- **Aura indicator**: complete glowing SVG ring around every avatar (see `05-GAMIFICATION.md`)
  - 0 interactions: gray
  - 1: blue
  - 2-5: purple
  - 6-15: gold
  - 16+: emerald

### `<ContactForm>`
- Create/edit form
- Fields: name (required), email, linkedinUrl, githubUrl, role, companyId (dropdown), personalProjects, notes, avatar (file upload)
- Avatar: file input → `useMutation(api.contacts.generateUploadUrl)` → upload to Convex storage → `useMutation(api.contacts.setAvatar)`
- Company dropdown from `useQuery(api.companies.list)`
- On submit: `useMutation(api.contacts.create)` or `api.contacts.update`
- Redirects to contact list/detail on success

### `<ContactDetail>`
- **Data**: `useQuery(api.contacts.get, { id })`, `useQuery(api.interactions.listByContact, { contactId: id })`, `useQuery(api.tags.listByContact, { contactId: id })`
- Sections:
  - Profile header (avatar, name, role, company, links)
  - Tags section with `<TagManager>`
  - Notes & Personal projects
  - Edit button → `/contacts/:id/edit`
  - Delete button with confirmation
  - `<InteractionTimeline>`

### `<InteractionForm>`
- Quick form to log an interaction
- Fields: type (dropdown of enum), date (date picker, default today), notes (textarea), followUpDate (optional date picker)
- On submit: `useMutation(api.interactions.create)`
- Returns newly unlocked achievements (passes to parent for toast)
- Can be embedded in `<ContactDetail>` or used standalone

### `<InteractionTimeline>`
- Props: `interactions: Interaction[]`
- Vertical timeline with each interaction as a card
- Most recent first
- Each item: date, type icon/label, notes, follow-up info

### `<TagManager>`
- **Data**: `useQuery(api.tags.list)`
- Shows all tags as clickable badges
- Selected tags for current contact highlighted
- Click to assign/unassign → `useMutation(api.tags.assignToContact)` / `unassignFromContact`
- "+" button to create new tag (name + color picker)

### `<StatsPage>`
- **Data**: `useQuery(api.contacts.growthByMonth)`, `useQuery(api.interactions.weeklyCounts)`, `useQuery(api.goals.get)`, `useQuery(api.achievements.list)`
- Sections:
  - Summary cards: total contacts, total interactions, current streak, companies tracked
  - `<GrowthChart>` — line chart of contacts over time (Recharts)
  - `<WeeklyChart>` — bar chart of interactions per week (Recharts)
  - `<StreakHistory>` — longest streak, current streak
  - `<BadgeGrid>` — all achievements with locked/unlocked state

### `<GrowthChart>`
- Recharts `LineChart` with months on X axis, cumulative contact count on Y

### `<WeeklyChart>`
- Recharts `BarChart` with weeks on X axis, interaction count on Y

### `<BadgeGrid>`
- Grid of achievement badges
- Unlocked: colored, with icon and name
- Locked: grayscale, with "?" icon

### `<StreakHistory>`
- Text display of current streak, longest streak, best week

## State Management

| Concern | Solution |
|---|---|
| Server state | Convex `useQuery` / `useMutation` hooks |
| Form state | Local `useState` |
| Toast (achievements) | Local state + `<div>` overlay (no library) |
| Routing | `react-router-dom` v7, `createBrowserRouter` |

## Loading / Empty / Error States

| Pattern | What to show |
|---|---|
| Loading | Inline text or simple spinner ("Loading...") |
| Empty list | "No contacts yet. Add your first one!" with link to form |
| Empty search | "No results for \"xyz\"" |
| Error | "Something went loading X. Try again." |
| 404 (company/contact) | "Not found" with back link |

## Toast Notifications

On achievement unlock (returned from `interactions.create` mutation):
```typescript
const [toast, setToast] = useState<{ type: string; message: string } | null>(null);
// After mutation:
if (result.newAchievements.length > 0) {
  setToast({ type: result.newAchievements[0], message: "🎉 Achievement unlocked: ..." });
  setTimeout(() => setToast(null), 4000);
}
```

Simple absolute-positioned div at top-right. No external toast library.
