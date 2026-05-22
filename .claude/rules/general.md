# General Rules

Apply to the whole repo (frontend now, backend later).

## 1. Romanian, no diacritics (all user-facing text)
Every label, button, toast, validation message, email subject and backend error
message is in **Romanian without diacritics**. Use plain letters:

| Wrong (diacritics / English) | Correct |
|------------------------------|---------|
| `Autentificare reusita`      | `Autentificare reusita` |
| `Login successful`           | `Conectare reusita` |
| `Camp obligatoriu`           | `Camp obligatoriu` |

Conversation with the user is English; code comments and user-facing strings are
Romanian-no-diacritics.

## 2. Standardized API response format
Every backend response — and every mock service in `finco-web/` — uses:

```ts
interface ApiResponse<T> {
  status: 'success' | 'error';
  message: string;   // romana fara diacritice, gata de afisat
  data: T | null;
}
```

`message` is always display-ready. In the frontend it surfaces in a Toast (errors)
or a load-error state. Helpers already exist: `services/response.ts` (`ok`/`fail`)
and `hooks/unwrap.ts` (throws `Error(message)` for React Query).

## 3. Centralize anything that repeats
No magic strings/numbers inline when they appear more than once or risk being
re-typed: API routes, frontend routes, colors/sizes, recurring messages, limits,
status labels, select options. Each gets its own file under `constants/` (frontend)
or a dedicated config/constant (backend). See `rules/frontend.md` for the exact files.

## 4. What NOT to touch
- **`Finco/`** is the original prototype — the visual + behavioral reference only.
  Never edit it; read it when you need to know how a screen should look/behave.
- **`finco-specs.md`, `finco-web.md`, `instruction.md`** are specs — leave them
  unless the user asks to change a spec.

## 5. Two surfaces, one app
The product has two completely separate surfaces:
- **Cabinet (internal):** employees log in (email + parola, JWT). Prototype prefix
  `/app/*`; in prod it is the `app.finco.ro` subdomain (no prefix).
- **Public (client):** no account — clients open a tokenized link and upload a ZIP.
  Prod host `finco.ro`.

One build, two subdomains via nginx. The security boundary is the API (JWT), not
the hostname. Detail in `finco-web.md` §1 and `rules/domain.md`.
