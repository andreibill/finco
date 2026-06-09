# Domain Reference

Condensed glossary, data model and flows. Full detail in `finco-specs.md`.

## Glossary
- **Client** — the firm that sends files. Has `nume`, unique `email`, `activ`, and
  a per-client `zi_trimitere` (1-28, day of month it gets the automatic monthly email).
- **Period (`an_luna`)** — calendar month documents are collected for (e.g. `2026-05`).
  Same `an_luna` for all clients; only the send day differs per client.
- **Upload (lot)** — one actual ZIP upload via a link. `numar_lot` orders uploads
  within a period (1 = first of the month, 2 = second, ...) and namespaces files.
- **File** — one file extracted from a ZIP; folder structure is preserved.
- **Upload link** — public URL with a long unique token, an expiry, bound to one
  client + period. Reusable until expiry.
- **`document_request`** — the log of every client-facing email carrying an upload
  link: monthly-automatic, custom (employee), and public re-request. Records send
  result (`email_trimis`, `eroare`).
- **Upload status** — derived from period flags: `!are_upload` = no upload;
  `are_upload && !finalizat` = partial; `finalizat` = done (employee closed it).

## Data model (key fields)
- `user`: id, email (unique), parola (BCrypt), nume, notificari_active, is_admin.
  Doua roluri de angajat: `is_admin=true` (administrator, poate face actiuni extra)
  vs angajat obisnuit. Nu exista alte roluri.
- `client`: id, nume, email (unique), activ, zi_trimitere (1-28).
- `period`: id, client_id, an_luna, are_upload, finalizat. Unique `(client_id, an_luna)`.
- `upload_link`: id, client_id, period_id, token, automat, expira_la, folosit, created_by.
- `upload`: id, client_id, period_id, upload_link_id, numar_lot, nume_zip, numar_fisiere.
- `file`: id, upload_id, client_id, period_id, nume_fisier (relative path), cale_storage
  (UUID key), dimensiune, content_type.
- `document_request`: id, client_id, period_id (nullable), automat, subiect, mesaj,
  upload_link_id, created_by (null when automat or public), email_trimis, eroare.

**Request type is derived, not stored:** `automat=true` -> monthly;
`automat=false` + `created_by` set -> custom (employee); `automat=false` +
`created_by` null -> public.

## Flows
1. **Monthly (automatic):** daily job; for each active client whose `zi_trimitere`
   == today, idempotently create the current period if missing, generate an
   `upload_link` (`automat=true`) with configurable expiry, send email, log a
   `document_request`. New mid-month client: if the day passed, send immediately.
2. **Client upload:** open link -> validate token + show expiry -> select one ZIP ->
   client-side checks (is `.zip`, single file, size limit — UX only, backend is
   source of truth) -> backend validates, safely unzips, stores files, sets
   `period.are_upload=true`, notifies employees. Link stays reusable until expiry.
3. **Custom request (employee):** pick client (current month only in MVP) -> generate
   link (`automat=false`, `created_by`=employee) -> send -> log.
4. **Public re-request:** client enters email -> if it exists & active, new link for
   current period, send, log (`created_by`=null). Generic response otherwise.

## API endpoints
Public: `GET|POST /api/public/upload/{token}`, `POST /api/public/request-link`.
Auth: `POST /api/auth/{login,refresh,logout}`.
Clients: `GET|POST /api/clients`, `GET|PUT /api/clients/{id}`,
`GET /api/clients/{id}/periods`, `GET /api/clients/{id}/document-requests`.
Library: `GET /api/periods/{id}/files`, `GET /api/files/{id}/download`,
`GET /api/periods/{id}/download`, `PUT /api/periods/{id}/finalizat`.
Requests: `GET|POST /api/document-requests`.
Profile: `GET /api/me`, `PUT /api/me/notifications`.
All return `ApiResponse<T>`. The full route map is mirrored in
`finco-web/src/constants/api-routes.ts`.

## Roles
Two employee roles only: **administrator** (`user.is_admin=true`) and ordinary
employee. Admins can perform extra actions; otherwise both see the same cabinet
screens. There are no finer-grained permissions in stage 1.

## Out of scope (stage 1)
Required-file validation, finer-grained roles/permissions beyond admin/non-admin,
multi-tenant, email open/click tracking, WhatsApp integration, OCR, targeting past
months (re-request & custom target the current month only).
