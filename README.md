# FINCO

> Centralized monthly file library for an accounting firm. Clients upload a ZIP
> through a tokenized link received by email; employees see, per client and per
> month, what was received and what is still missing.

## The problem

Today every client sends their monthly documents (invoices, statements, receipts)
on a different channel — WhatsApp, email, whatever. There is no single place,
employees waste time gathering files, and nobody has visibility into what arrived
and what is missing.

FINCO fixes this with **one library per client**, where files always arrive the
same way: an upload link sent by email.

## How it works

- **Monthly (automatic):** a daily job emails each active client an upload link on
  their configured send-day (`zi_trimitere`, 1-28), idempotently, and logs it.
- **Client upload:** the client opens the link (no account), picks one `.zip`, and
  uploads. The backend safely unzips it (zip-slip / zip-bomb guarded), stores files
  in object storage, and notifies employees. The link stays reusable until expiry.
- **Custom request:** an employee can generate a link and email a client for extra
  files for the current month.
- **Public re-request:** a client who lost the email enters their address on a
  public page and gets a fresh link (generic response, anti-enumeration).
- **Library:** employees browse clients → periods → upload batches (`lot`) → files,
  with a per-client upload status (none / partial / done), and download single files
  or a whole period as a ZIP.

## Architecture

Two completely separate surfaces, one build:

| Surface | Who | Auth | Prod host |
|---------|-----|------|-----------|
| **Cabinet** (internal) | Firm employees | Email + password (JWT, httpOnly cookie) | `app.finco.ro` |
| **Public** (client) | Clients uploading files | None — tokenized link | `finco.ro` |

```
finco/
  finco-web/        # [BUILT] React SPA (Vite + TS, React Router, TanStack Query)
  Finco/            # [READ-ONLY] CDN-React prototype — visual reference, do not edit
  finco-specs.md    # domain + backend spec (entities, flows, security)
  finco-web.md      # frontend spec, screen by screen
  instruction.md    # from-scratch build brief for finco-web/
  .claude/          # Claude Code config: CLAUDE.md + rules/ + skills/
```

> There is **no backend repo yet** — `finco-specs.md` and `.claude/rules/backend.md`
> are the contract for when it is created.

## Tech stack

- **Backend (planned):** Java + Spring Boot REST API, organized by domain
  (`client`, `period`, `uploadlink`, `upload`, `file`, `documentrequest`, `auth`,
  `notification`), layer flow `Controller → Orchestrator → Service → Repository`.
- **Frontend:** Vite + React + TypeScript SPA, React Router, TanStack Query, plain
  CSS with design tokens. Currently runs against a mock service layer (no real
  backend), with the API seam kept clean for a one-for-one swap later.
- **Database:** PostgreSQL (metadata only).
- **File storage:** S3-compatible object storage (MinIO in dev, S3 in prod).
- **Email:** SMTP behind an `EmailSender` interface (provider swappable from config).
- **Auth:** JWT (short access + refresh), BCrypt passwords.

## Conventions

- Every API response is `ApiResponse<T>` (`status` / `message` / `data`), with
  `message` ready to display.
- All user-facing strings and code comments are in **Romanian without diacritics**.
- Frontend: no hardcoded API routes, frontend routes, colors or sizes — everything
  recurring lives in `constants/` (or `colors_and_type.css`). All server calls go
  through a service + React Query hook. Filters / search / tabs live in the URL.

See `.claude/CLAUDE.md` and `.claude/rules/` for the full development rules.

## Running the frontend

```bash
cd finco-web
npm install
npm run dev        # dev server on http://localhost:7070
```

- `localhost:7070/`     → public client pages (upload via tokenized link)
- `localhost:7070/app`  → cabinet app (login + library)

Verify changes with `npm run build` and `npx tsc --noEmit` (both must pass clean).

## Out of scope (stage 1)

Required-file validation, employee roles, multi-tenant, email open/click tracking,
WhatsApp integration, OCR, and targeting past months (re-request and custom request
target the current month only).
```
