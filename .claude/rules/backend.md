# Backend Rules (planned API)

There is **no backend repo yet**. This file is the contract for when it is created,
derived from `finco-specs.md` §7-§12. Stack: **Java + Spring Boot**, PostgreSQL
(metadata), S3-compatible object storage (MinIO dev / S3 prod), SMTP email, JWT auth.

## 1. Organize by domain, not by technical layer
There are **no** global `controller/`/`repository/` packages collecting everything.
Each domain is a self-contained package holding its own Controller, Orchestrator,
Service, Repository, entity and DTOs. Domains:
`client`, `period`, `uploadlink`, `upload`, `file`, `documentrequest`, `auth`,
`notification`.

Cross-cutting concerns get dedicated packages: `email` (the `EmailSender` interface),
`storage` (object-storage client), `common` (`ApiResponse`, shared exceptions),
`config`. An Orchestrator lives in its primary domain's package even when it uses
Services from other domains.

## 2. Layer flow (strict)
```
Controller  ->  Orchestrator  ->  Service  ->  Repository
```
| Layer | Does | Can call | Cannot call |
|-------|------|----------|-------------|
| Controller | HTTP only (request/response, input validation) | Orchestrators | Services, Repositories |
| Orchestrator | Coordinates a use case; cross-domain coordination | Services, utilities | Other Orchestrators, Repositories directly |
| Service | Single-domain business logic | **Only its own** Repository | Other Services, other Repositories |
| Repository | Data access for one entity | DB | anything else |

- Controllers never call Services directly — even for trivial ops, go through an
  Orchestrator.
- A Service never calls another Service (prevents cycles). Need another domain's
  data? The Orchestrator coordinates it.
- Create an Orchestrator when the use case touches 2+ services, has real flow logic,
  or needs transaction coordination. Name `{UseCase}Orchestrator` (e.g.
  `UploadOrchestrator`, `DocumentRequestOrchestrator`).

## 3. Standard response
Every endpoint returns `ApiResponse<T>` (`status` / `message` / `data`), with
`message` in Romanian without diacritics. See `rules/general.md` §2.

## 4. Security (non-negotiable)
- **Upload links:** random token >= 32 bytes (base64url), mandatory expiry, strict
  client+period binding. Public page reveals only the minimum.
- **Public request-link form:** generic response regardless of whether the email
  exists (anti-enumeration); rate-limit by IP **and** email.
- **ZIP upload:** validate it is a ZIP and the size limit; unzip safely with
  zip-slip / zip-bomb protection (total-size cap, file-count cap, reject relative
  paths); sanitize file names.
- **Employee auth:** JWT (short access + refresh), BCrypt passwords. The token is an
  httpOnly cookie scoped to `app.finco.ro` (host-only, NOT `.finco.ro`).
- **Storage:** object-storage keys are unguessable (UUID, not derived from file
  name); download only via an authenticated endpoint (pre-signed short URL or stream).
- HTTPS only.

## 5. Email
Abstracted behind an `EmailSender` interface (`send(EmailMessage)`); initial impl
`SmtpEmailSender`, provider swappable from config (SendGrid/SES later) with no
business-logic change. Every client-facing email with an upload link is logged as a
`document_request` row. Internal upload notifications to employees are NOT logged
there (no client link).

## 6. Connector-agnostic config
All deploy-specific values (DB, storage, SMTP, allowed origins, link expiry, ZIP
size limit) come from environment variables / `application.properties` — never
hardcoded.
