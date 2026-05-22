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
- [ ] Reuse the UI kit (`components/`); extend a primitive instead of duplicating.
- [ ] Romanian without diacritics in every user-facing string.

**Backend (when it exists)**
- [ ] Organized by domain, not by technical layer.
- [ ] Flow: Controller -> Orchestrator -> Service -> Repository.
- [ ] Service calls only its own Repository; never another Service.
- [ ] Every response is `ApiResponse<T>`.
