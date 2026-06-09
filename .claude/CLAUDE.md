# FINCO Expert - Claude Instructions

> Biblioteca centralizata de fisiere lunare pentru un cabinet de contabilitate.
> Clientii incarca un ZIP printr-un link tokenizat primit pe email; angajatii vad
> in biblioteca ce s-a primit, pe luni, per client.

## Communication
- Conversations with the user are in **English** by default (unless asked otherwise).
- Code comments, UI text, commit messages and user-facing strings stay in
  **Romanian without diacritics** (`a` not `a/a`, `i` not `i`, `s` not `s`, `t` not `t`).

## Rules - read the relevant file before writing code
Rules are split into separate files so this index stays small. Open the one that
matches your task; do not assume — read it.

- [General](rules/general.md) - language, `ApiResponse<T>`, repo layout, what NOT to touch.
- [Frontend](rules/frontend.md) - `finco-web/` SPA: stack, constants, React Query, URL-as-state, plain CSS, component reuse.
- [Backend](rules/backend.md) - planned Java/Spring API: domain packages, layer flow, security.
- [Domain](rules/domain.md) - glossary, data model, flows, API endpoints (reference).

## Keeping rules in sync (always)
The rule files are a living contract — keep them honest:
- **When a rule looks outdated** (the code/structure no longer matches what a rule
  says, or work you just did contradicts it), stop and **ask the user whether to update
  the rule** before assuming either side is right. Do not silently follow a stale rule
  or silently rewrite it.
- **When the user asks for something that breaks an existing rule**, say so explicitly —
  name the rule and the conflict — and **ask whether the rule should be updated** (or the
  request adjusted) before proceeding. Never quietly violate a rule.

## Source-of-truth documents (at repo root)
- `finco-specs.md` - domain + backend spec (entities, flows, security).
- `finco-web.md` - frontend spec, screen-by-screen (the SPA's source of truth).
- `instruction.md` - the from-scratch build brief for `finco-web/`.

## Repo layout (current state)
```
finco/
  finco-web/        # [BUILT] the React SPA - see rules/frontend.md
  Finco/            # [READ-ONLY] CDN-React prototype, the visual reference. DO NOT edit.
  finco-specs.md    # domain + backend spec
  finco-web.md      # frontend spec
  instruction.md    # build brief
  .claude/          # this folder: CLAUDE.md + rules/ + skills/
```
> There is **no backend repo yet** — `rules/backend.md` is the contract for when it
> is created (Java + Spring Boot, per `finco-specs.md`).

## Skills
Reusable workflows live in [`skills/`](skills/) (one folder per skill, each with a
`SKILL.md`). This set grows over time — see `skills/README.md` before adding one.

## Quick checklist
**Frontend (`finco-web/`)**
- [ ] No hardcoded API routes - use `API_ROUTES` from `constants/api-routes.ts`.
- [ ] No hardcoded frontend routes - use `ROUTES` from `constants/routes.ts`.
- [ ] No hardcoded colors / sizes - only `var(--token)` from `colors_and_type.css`.
- [ ] All backend calls go through a service + a React Query hook (no `fetch` in components).
- [ ] Filters / search / tabs live in the URL (query params), URL is the source of truth.
- [ ] Plain CSS, one `.css` co-located per component/page. No Tailwind / CSS-in-JS.
- [ ] `pages/` holds ONLY routable screens (split `public/private`, one page per folder).
- [ ] Page-specific components live in `features/<surface>/<Page>/`; shared ones in `components/` (cross-screen modals in `components/modals/`).
- [ ] Reuse the UI kit (`components/`, grouped in functional subfolders); extend the base primitive instead of duplicating (`PasswordInput` wraps `Input`).
- [ ] Cross-folder imports use `@`-aliases (`@components`, `@hooks`, ...), never `../../..`.
- [ ] Romanian without diacritics in every user-facing string.

**Backend (when it exists)**
- [ ] Organized by domain, not by technical layer.
- [ ] Flow: Controller -> Orchestrator -> Service -> Repository.
- [ ] Service calls only its own Repository; never another Service.
- [ ] Every response is `ApiResponse<T>`.
