# 08 — Git Strategy

## Principles

- Single developer, no PR reviews.
- **One commit per atomic task** from the roadmap.
- **One PR per phase** as a checkpoint — merge to `main` when a phase is complete and working.
- Commits are recoverable checkpoints, not a story. Don't overthink messages.

## Branches

| Branch | Purpose |
|---|---|
| `main` | Stable, working state. Always deployable. |
| `phase-N-name` | Working branch for the current phase. Created from `main`, merged back when done. |

### Naming

```
phase-1-schema
phase-2-companies
phase-3-contacts
phase-4-interactions
phase-5-tags
phase-6-dashboard
phase-7-gamification
```

## Commits

### Format

```
type: short description
```

Types: `feat`, `refactor`, `fix`, `docs`, `chore`.

### Examples

```
feat: add companies schema + CRUD backend
feat: add companies list and form UI
feat: add contact avatar upload
feat: add interaction timeline component
refactor: extract aura indicator into shared component
fix: streak calculation breaks on month boundary
docs: update AGENTS.md with Tailwind v4 setup
```

### Granularity

Each commit = one atomic task from `06-ROADMAP.md`. If a task touches both backend and frontend (e.g., "add companies CRUD"), it's **one commit**, not two.

### When to commit

After every task where the app compiles and runs without errors. Don't commit broken state.

## PRs (checkpoints)

### Phases → PRs

| PR # | Phase | User Stories |
|---|---|---|
| 1 | Schema + Backend | — (infrastructure) |
| 2 | Companies CRUD | US-01 al US-05 |
| 3 | Contacts CRUD | US-06 al US-11 |
| 4 | Interactions | US-12 al US-17 |
| 5 | Tags | US-18 al US-20 |
| 6 | Dashboard | US-21 al US-23 |
| 7 | Gamification + Stats | US-24 al US-33 |
| 8 | Polish (aura, empty states) | US-34 |

### PR description template

```markdown
## Phase N: {name}

### Changes
- {commit 1 description}
- {commit 2 description}
- ...

### User stories covered
- [ ] US-XX
- [ ] US-YY

### Verification
- [ ] `npm run build` passes
- [ ] `npm run lint` passes
- [ ] Tested manually
```

### Workflow

```bash
git checkout -b phase-3-contacts
# ... code, code, code
git add convex/contacts.ts src/components/contacts/
git commit -m "feat: add contacts CRUD backend + frontend"
# ... more commits
git checkout main
git merge phase-3-contacts
git push origin main
git branch -d phase-3-contacts
```

No force push, no rebase. Just merge commits.

## Push frequency

Push after each PR merge to `main`. This keeps the remote in sync and makes the docs available for AI-assisted development in fresh clones.
