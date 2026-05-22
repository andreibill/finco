# BUILD INSTRUCTIONS — finco-web (read this first, no prior context assumed)

You are about to build the FINCO Expert web app from scratch. You have **no
memory** of the conversation that produced this file. Everything you need is
here or in the two reference files below. Read this whole file before writing
any code.

## 0. What you are building (one paragraph)

A React SPA called **FINCO Expert** for an accounting firm ("cabinet"). It has
**two surfaces**: an internal **cabinet app** (employees log in, manage clients,
see uploaded files, send document-request emails) and **public client pages**
(clients open a tokenized link and upload a monthly `.zip`). There is **no real
backend yet** — every API call is served by a **mock layer** (in-memory fixtures
+ simulated latency). Build the **full app**, both surfaces, all screens.

## 1. Reference files (READ THESE)

- **`finco-web.md`** — the frontend spec. THE source of truth. Every section
  (§1–§12) matters. Read it fully before starting. Screen-by-screen detail is in
  §5 (cabinet) and §6 (public); cross-cutting states in §7; conventions in §12.
- **`finco-specs.md`** — domain + backend spec (data model, flows). Read for
  context on entities (client, period/`an_luna`, upload `lot`, `document_request`).
- **`Finco/`** — the existing **prototype** (React via CDN + Babel, `.jsx`,
  globals on `window`). This is the visual + behavioral reference you are
  PORTING to a real Vite + TS project. Files:
  - `Finco/colors_and_type.css` — design tokens. **Copy as-is** into the new app.
  - `Finco/index.html` — bootstrap + (prototype-only) SurfaceSwitcher. DO NOT
    port the SurfaceSwitcher; routing replaces it (see §4 below).
  - `Finco/app/Primitives.jsx` — the UI kit. Port each to a typed component.
  - `Finco/app/Data.jsx` — fixtures. Port into the mock layer.
  - `Finco/app/Shell.jsx` — Logo, FincoMark, Sidebar, TopBar. **Read during build.**
  - `Finco/app/{LoginScreen,LibraryScreen,ClientDetailScreen,PeriodDetailScreen,RequestsScreen,RequestDocumentsModal,InternalApp,PublicScreens,PublicApp}.jsx`
    — **Read each one when you build the matching screen** to port markup/behavior
    faithfully. Do not guess; the prototype is the design reference.

> Important: the prototype uses inline `style={{...}}` objects. The new app must
> NOT do that — convert all styling to **plain CSS files** (see rules below).
> The inline styles are just the source of the visual design; translate them to
> CSS using the design tokens.

## 2. Target location & stack

- **Location:** new folder **`finco-web/`** at repo root. Leave `Finco/`,
  `finco-web.md`, `finco-specs.md` untouched.
- **Stack:** Vite + React + **TypeScript**; **React Router** (routing);
  **TanStack Query** (`@tanstack/react-query`) for all server state;
  **lucide-react** for icons (prototype used the `lucide` CDN). Package manager:
  **npm**. Dev server **port 7070**.

## 3. HARD RULES (from finco-web.md §12 — do not violate)

1. **Romanian, no diacritics** in ALL user-facing text (labels, buttons, toasts,
   errors). Use `a` not `ă/â`, `i` not `î`, `s` not `ș`, `t` not `ț`. Code/comments
   also Romanian-without-diacritics where they’re user-facing; conversation is English.
2. **Plain CSS only — no Tailwind / no CSS-in-JS / no UI libraries.** Each page
   and each component has its **own dedicated `.css` file co-located** next to its
   `.tsx` (e.g. `LoginScreen/LoginScreen.tsx` + `LoginScreen/LoginScreen.css`),
   imported only by that file. Shared tokens live in `colors_and_type.css`.
3. **Nothing hardcoded that repeats — centralize in `constants/`:**
   - `constants/api-routes.ts` → `API_ROUTES` (every endpoint string).
   - `constants/routes.ts` → frontend routes (cabinet `/app/*`, public).
   - colors/sizes/type → ONLY via tokens in `colors_and_type.css` (CSS vars). No
     hardcoded hex/px in component CSS — use `var(--token)`.
   - other recurring values (messages, limits, status labels, select options) →
     their own file in `constants/`.
4. **All backend calls via React Query** (`useQuery` / `useMutation`) through the
   service layer. No `fetch`/axios directly in components.
5. **Filtering, search, tabs, pagination live in the URL** (query params), the URL
   is the source of truth. Examples: `?cauta=...&status=partial`,
   `/app/cereri?tab=esuate`. React Query uses these params as the query key.
6. **Reuse components; extend, don’t duplicate.** Build the UI kit once in
   `components/`; screens compose it. If a primitive almost fits, extend it (e.g.
   `PasswordInput` wraps `Input` and adds the show/hide toggle) — never re-implement.
7. **Folder division: by type/domain first, then by feature.** `pages/`,
   `components/`, `hooks/`, `services/`, `constants/`, etc.; each page/component is
   its own folder holding `.tsx` + `.css`.

## 4. Routing model (CRITICAL — read finco-web.md §1 + §2)

- Two surfaces on ONE dev origin (`localhost:7070`), separated by **route prefix**:
  - **Public** surface at `/*` (e.g. `/upload/:token`, `/cere-link`).
  - **Cabinet** surface under **`/app/*`** (e.g. `/app/login`, `/app/`,
    `/app/clienti/:id`, ...).
- **The `/app` prefix is PROTOTYPE-ONLY.** In production the cabinet is the
  `app.finco.ro` subdomain, so the prefix is dropped (`/login`, `/biblioteca`).
  Define routes in `constants/routes.ts` with the `/app` prefix so it’s a single
  place to change later. The per-screen "Ruta (prod)" values in §5 are the
  prefix-less prod forms; in the prototype they get the `/app` prefix.
- There is **NO SurfaceSwitcher** and **NO footer state-switcher** — navigation
  is real routing only.
- Cabinet routes (prototype paths):
  - `/app/login` → LoginScreen (only when not authed)
  - `/app/` (alias `/app/biblioteca`) → LibraryScreen (default after login)
  - `/app/clienti/:id` → ClientDetailScreen
  - `/app/clienti/:id/perioade/:periodId` → PeriodDetailScreen
  - `/app/cereri` → RequestsScreen
  - `/app/setari` → SettingsScreen
- Public routes: `/upload/:token` → UploadPage (states: valid → uploading → done
  ►SuccessPanel; expired ►ExpiredPanel); `/cere-link` → RequestLinkPage.
- Lazy-load each surface (`React.lazy` + `import()`) so the public visitor
  doesn’t download the cabinet bundle (§1).

## 5. Auth + the hydration gate (finco-web.md §5.0)

- **`AuthContext`** wraps the cabinet surface only (clients have no account).
  Exposes: `user | null`, `authed` (= `!!user`), `isHydrating`, `login(creds)`,
  `logout()`.
- **Two-phase auth gate** in the cabinet container:
  1. **`isHydrating`**: on first load try to restore the session → render a
     **splash/loading screen**, NOT LoginScreen (avoid login flash).
  2. After hydration: `!authed` → LoginScreen; else → Shell + routed screen.
- **Mock auth:** `login()` always succeeds after ~600ms; persist an `authed`
  flag (and the mock `CURRENT_USER`) in `localStorage` so the `isHydrating` gate
  has something to restore on reload. `logout()` clears it and redirects to the
  login route. No real JWT/cookie in the mock.
- Token would normally be an httpOnly cookie (NOT in JS) — note this but the mock
  just uses localStorage.

## 6. Mock data layer (no backend)

- **Fixtures:** port `Finco/app/Data.jsx` into `finco-web/src/mocks/fixtures.ts`
  (typed): `CURRENT_PERIOD`, `CURRENT_PERIOD_LABEL`, `CURRENT_USER`,
  `CLIENTS_FIXTURE`, `FILES_FIXTURE` (keyed by period id), `REQUESTS_FIXTURE`.
- **Service layer:** `src/services/*.ts` — one class/object per domain
  (auth, clients, periods, files, documentRequests, me, public). Every method:
  - is keyed by an `API_ROUTES` constant (even though mock),
  - returns `Promise<ApiResponse<T>>` where
    `ApiResponse<T> = { status: 'success' | 'error'; message: string; data: T | null }`
    (finco-web.md §3 / general rules),
  - simulates latency with a small `delay()` helper (~400–700ms; login ~600ms;
    request-send ~700ms),
  - reads/writes the in-memory fixtures (let mutations like "adauga client",
    "marcheaza finalizat", "trimite cerere" mutate the in-memory store so the UI
    updates after React Query invalidation).
- **Goal: swapping to a real backend later = rewrite each service’s body to call
  `fetch(API_ROUTES.X)`**, with zero changes in components/hooks. Keep that seam clean.
- **Hooks:** `src/hooks/*.ts` — `useQuery`/`useMutation` wrappers per domain
  (e.g. `useClients`, `useClient`, `usePeriods`, `usePeriodFiles`,
  `useDocumentRequests`, `useLogin`, `useMe`, `usePublicUploadContext`,
  `useUploadFiles`, `useRequestLink`). Mutations invalidate affected queries (§7).

## 7. Target folder structure (finco-web.md §1 "Structura la implementare")

```
finco-web/
  index.html                # Vite entry; <html lang="ro">; favicon
  package.json  vite.config.ts  tsconfig.json
  public/
    finco-logo.jpg          # COPIED from Finco/assets/finco-logo.jpg (favicon + Logo)
  src/
    main.tsx                # ReactDOM root + QueryClientProvider + BrowserRouter + AppRouter
    AppRouter.tsx           # top-level router: public routes + /app/* (lazy). NOT named App.tsx — see gotcha #macos
    colors_and_type.css     # COPIED from Finco/, imported once in main.tsx
    constants/
      api-routes.ts         # API_ROUTES
      routes.ts             # ROUTES (frontend, /app/* prefix)
      messages.ts           # recurring UI strings if reused (optional)
    types/                  # ApiResponse<T>, Client, Period, FileItem, DocumentRequest, User
    mocks/
      fixtures.ts
      delay.ts
    services/               # one per domain, return ApiResponse<T>
    hooks/                  # React Query hooks per domain
    contexts/
      AuthContext.tsx
    components/             # UI kit, each in own folder w/ .tsx + .css
      Icon/ Button/ IconButton/ StatusPill/ Badge/ Avatar/ Field/ Input/
      PasswordInput/ Textarea/ Card/ Modal/ Toast/ ToastProvider/ Tabs/
      Logo/ FincoMark/ Sidebar/ TopBar/ Skeleton/ EmptyState/
    pages/
      LoginScreen/
      LibraryScreen/
      ClientDetailScreen/
      PeriodDetailScreen/
      RequestsScreen/
      SettingsScreen/
      ClientFormModal/      # §5.8 — NOT in prototype, MVP-critical, build it
      RequestDocumentsModal/
      public/
        PublicShell/
        UploadPage/        # contains screen-local: HeroPanel, UploadRightPanel, DropZone, FileTile
        RequestLinkPage/
        SuccessPanel/
        ExpiredPanel/
    surfaces/              # NOT named app/ (collides with App.tsx on case-insensitive macOS FS)
      InternalApp/         # cabinet container: AuthContext + gate + /app router + Shell + global overlays (RequestDocumentsModal, Toast)
      PublicApp/           # public container
    utils/                 # formatPeriodLabel, etc.
```

**Screen-local vs shared composites.** These appear in the spec but are NOT
global UI kit — keep them with their screen UNLESS reused across screens:
- screen-local: `KpiCard`, `SegmentedFilter`, `ClientRow` (Library); `PeriodRow`
  (ClientDetail); `LotGroup`, `FileRow` (PeriodDetail); `ClientPicker`
  (RequestDocumentsModal); `HeroPanel`, `UploadRightPanel`, `DropZone`, `FileTile`
  (UploadPage).
- shared (put in `components/`): `SplitCard` (reused by UploadPage / SuccessPanel
  / ExpiredPanel).

## 8. UI kit to port (from Primitives.jsx + Shell.jsx)

Port each with the SAME props/variants as the prototype, but typed + plain CSS:
- `Icon` — keep the prototype’s **string `name`** API (icons are referenced as
  `iconLeft="mail"`, `name="eye-off"`, etc. all over). lucide-react exports
  PascalCase components, not a name lookup, so build Icon to map the kebab/lower
  name → component (e.g. `import { icons } from 'lucide-react'` and index by the
  PascalCase key, or a small explicit map of the names actually used). Props:
  `name`, `size`, `stroke`. Don’t change call sites to import individual icons.
- `Button`
  (variants primary/secondary/ghost/danger/inverse; sizes sm/md/lg; iconLeft/Right;
  disabled), `IconButton` (name,label,tone; always `aria-label`=label),
  `StatusPill` (status empty/partial/complete/error; keeps TEXT not just color — §9),
  `Badge` (neutral/brand/mono), `Avatar` (initials,size,tone orange/graphite),
  `Field`+`Input` (label,hint,error,iconLeft,orange focus ring), `PasswordInput`
  (extends Input, eye/eye-off toggle — this is the §5.1 "de adaugat" toggle),
  `Textarea`, `Card` (padding,hoverable), `Modal` (title,subtitle,footer,width;
  close on backdrop + x + Esc; focus trap + a11y per §9), `Toast` + a
  `ToastProvider`/hook for transient toasts (~3.2s auto-dismiss), `Tabs`
  (tabs[{value,label,count}]).
- From Shell: `Logo` (wordmark FINCO + "expert"), `FincoMark` (SVG), `Sidebar`
  (nav: Biblioteca, Clienti(=alias Biblioteca), Cereri trimise, Setari; user card
  + logout at bottom; active item = orange wash), `TopBar` (breadcrumbs, title,
  subtitle, right actions). Also `Toggle` (on/off switch, used in Settings).
- Add `Skeleton` (loading rows) and `EmptyState` (icon + message + CTA) for §7.

## 9. Cross-cutting behavior (finco-web.md §7, §8, §9)

- **Loading:** lists/tables show skeletons while `isLoading`; action buttons show
  pending text ("Conectare...", "Se trimite...", "Se salveaza...").
- **Errors:** mutation errors → Toast tone err (use `ApiResponse.message`); screen
  load errors → inline error state + "Reincarca".
- **Empty states:** global (no clients → CTA "Adauga client"); per-filter ("Niciun
  client nu corespunde filtrelor"); period with no files.
- **Invalidation:** after every mutation invalidate affected queries.
- **Responsive:** cabinet desktop-first (≥1024px; Sidebar→drawer below, tables
  scroll-x); public must work on mobile (SplitCard stacks below ~720px). Breakpoints
  sm480/md768/lg1024/xl1280. Touch targets ≥44px.
- **A11y:** Modal focus trap + Esc + role=dialog/aria-modal/aria-labelledby;
  IconButton aria-label; clickable rows keyboard-focusable (Enter); visible
  `:focus-visible` orange ring; StatusPill keeps text; `<html lang="ro">`.

## 10. BUILD ORDER (do in this sequence; check off as you go)

> Track these with the task tools (TaskCreate/TaskUpdate). Mark in_progress before,
> completed after. Build, then run `npm run build` + `npx tsc --noEmit` to verify
> at the milestones marked ✅.

1. **Scaffold** `finco-web/` Vite React-TS project:
   `npm create vite@latest finco-web -- --template react-ts`, then
   `cd finco-web && npm install`, then
   `npm install react-router-dom @tanstack/react-query lucide-react`.
   Remove the template boilerplate (App.css, default App.tsx, demo assets).
   Set vite dev `server.port = 7070` in `vite.config.ts`. Copy
   `Finco/colors_and_type.css` → `src/` and `Finco/assets/finco-logo.jpg` →
   `public/`. Set `index.html` `<html lang="ro">` + title "FINCO Expert" + favicon.
   (No `/api` proxy needed — the mock layer replaces the backend.)
2. **Constants** (`api-routes.ts` from §10 of spec endpoint table; `routes.ts`).
3. **Types** (`ApiResponse<T>`, Client, Period, FileItem, DocumentRequest, User).
4. **Mocks** (`fixtures.ts` ported from Data.jsx, `delay.ts`).
5. **Services** (auth, me, clients, periods, files, documentRequests, public) →
   `ApiResponse<T>` + delay + mutate in-memory store.
6. **UI kit** in `components/` (port Primitives + Shell; add PasswordInput,
   Toast system, Skeleton, EmptyState). Each with its own CSS. ✅ build check.
7. **Hooks** (React Query per domain).
8. **AuthContext** + the two-phase hydration gate (mock auth via localStorage).
9. **Cabinet container** `InternalApp.tsx`: gate, `/app/*` routes, Shell layout,
   global Toast + RequestDocumentsModal mount.
10. **Cabinet screens** — read each prototype `.jsx` first, then build with CSS +
    hooks + URL-driven filters:
    LoginScreen → LibraryScreen (KPI band, search+segmented filter in URL, client
    table, empty states) → ClientDetailScreen → PeriodDetailScreen (files grouped
    by `lot`, downloads, "Marcheaza finalizat") → RequestsScreen (Tabs in URL) →
    SettingsScreen (profile + notifications Toggle).
11. **ClientFormModal** (§5.8): add/edit client; validation (nume nevid, email
    valid, zi 1-28); POST/PUT via mock; toast + invalidate. Wire "Adauga client"
    (Library toolbar) and "Editeaza" (ClientDetail).
12. **Public container** `PublicApp.tsx` + PublicShell, then UploadPage (DropZone,
    FileTile, progress, .zip + 50MB + single-file validation → Toast err; states),
    SuccessPanel, ExpiredPanel, RequestLinkPage (generic success, contains '@' check).
13. **`AppRouter.tsx` routing**: public `/*` + lazy `/app/*` (mount InternalApp
    under `/app/*`, PublicApp under `/*`); 404 fallback. ✅ build check.
14. **Final pass:** `npm run build` clean, `npx tsc --noEmit` clean; click through
    every route in both surfaces; verify rules in §3 (grep for hardcoded hex/px in
    component CSS, hardcoded route strings, inline styles). Fix the simplify pass.

## 11. DEFINITION OF DONE

- `finco-web/` runs on `localhost:7070`; `/` shows public upload-link flow,
  `/app/login` → (mock login) → `/app/` Biblioteca with the 8 fixture clients.
- All screens from finco-web.md §5 + §6 exist and navigate per §2, incl.
  ClientFormModal.
- Mock services return `ApiResponse<T>`; mutations update the UI via invalidation.
- No Tailwind/CSS-in-JS; per-file CSS; tokens only; constants centralized; filters
  in URL; React Query everywhere; Romanian-no-diacritics.
- `npm run build` and `npx tsc --noEmit` both pass with no errors.

## 12. NOTES / GOTCHAS

- Don’t port inline styles — translate to CSS with tokens.
- Don’t recreate the SurfaceSwitcher or footer DemoLink switcher.
- `formatPeriodLabel("2026-05") -> "mai 2026"` helper (Romanian month names, no
  diacritics) — put in a `utils/`.
- Files grouped by `lot` (sort keys ascending). File-type colors: pdf red, xls
  green, img blue, zip orange (`FILE_TYPE_STYLES`).
- Request "tip" is derived, not stored: `automat`→"automat";
  `!automat && created_by==='public'`→"public"; else "custom".
- Endpoints marked "(de adaugat)" in spec (e.g. `PUT /api/periods/:id/finalizat`,
  per-lot download) — define them in `API_ROUTES` and mock them; they’re expected.
- **#macos:** the filesystem is case-insensitive. Do NOT have both a file `App.tsx`
  and a folder `app/` — they collide. That’s why the router root is `AppRouter.tsx`
  and the surface containers live in `surfaces/`, not `app/`.
- When unsure about look/behavior of a screen, OPEN the matching prototype `.jsx`.
