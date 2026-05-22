# Frontend Rules (`finco-web/`)

The web app is a standalone SPA. Source of truth for screens is `finco-web.md`
(read the matching §5/§6 section before building/changing a screen) and, for
look & behavior, the prototype in `Finco/app/*.jsx`.

## Stack
- **Vite + React + TypeScript**, dev server on **port 7070**.
- **React Router** (`react-router-dom`) for routing.
- **TanStack Query** (`@tanstack/react-query`) for all server state.
- **lucide-react** for icons (via the `Icon` wrapper, string `name` API).
- **Plain CSS only.** No Tailwind, no CSS-in-JS, no UI libraries.
- **No real backend** — a mock layer (`src/mocks/` + `src/services/`) serves every
  call with simulated latency. Keep the seam clean (see "Mock layer" below).

## 1. No hardcoded API routes
Use `API_ROUTES` from `src/constants/api-routes.ts`. Services key every call by a
constant even though they're mocked, so swapping to a real backend = rewrite each
service body to `fetch(API_ROUTES.X)` with zero component changes.

```ts
// WRONG
await fetch('/api/clients');
// CORRECT
import { API_ROUTES } from '../constants/api-routes';
await fetch(API_ROUTES.CLIENTS.LIST);
```

## 2. No hardcoded frontend routes
Use `ROUTES` from `src/constants/routes.ts`. The `/app` prefix lives in one place
there (prototype-only; dropped in prod). Never type route strings inline.

## 3. No hardcoded colors or sizes
Only `var(--token)` from `src/colors_and_type.css` (brand, neutrals, status,
spacing, radii, shadows, typography). No raw hex/px in component CSS. The tokens
file is copied from `Finco/colors_and_type.css` and imported once in `main.tsx`.

## 4. All backend calls via React Query
Components never call `fetch`/services directly. The chain is:

```
component  ->  hook (useQuery / useMutation)  ->  service (ApiResponse<T>)  ->  mock/fetch
```

- Services live in `src/services/*.service.ts`, return `Promise<ApiResponse<T>>`,
  simulate latency with `mocks/delay.ts`, and mutate the in-memory fixture store.
- Hooks live in `src/hooks/*.ts`, use `unwrap()` to turn `ApiResponse<T>` into the
  payload (or throw `message`), and use centralized keys from `hooks/queryKeys.ts`.
- **After every mutation, invalidate the affected queries** so the UI reflects
  real state without a manual reload.

```ts
const { data } = useQuery({ queryKey: queryKeys.clients(filters), queryFn: () => unwrap(clientsService.list(filters)) });
```

## 5. Filters / search / tabs / pagination live in the URL
Query params are the source of truth (`?cauta=...&status=partial`,
`/app/cereri?tab=esuate`). The component reads from the URL — it does not keep a
separate copy — and the params become part of the React Query key, so changing a
filter refetches automatically. State stays shareable, bookmarkable, refresh-proof.

## 6. Plain CSS, co-located, one per file
Each page and each component has its own dedicated `.css` next to its `.tsx`
(e.g. `LoginScreen/LoginScreen.tsx` + `LoginScreen/LoginScreen.css`), imported only
by that file. Shared design tokens stay in `colors_and_type.css`. Do not port the
prototype's inline `style={{...}}` — translate them to CSS using tokens.

## 7. Reuse the UI kit; extend, don't duplicate
The UI kit is in `src/components/` (barrel: `components/index.ts`) — `Button`,
`Input`, `Field`, `Card`, `Modal`, `StatusPill`, `Badge`, `Avatar`, `Toast`/
`ToastProvider`, `Tabs`, `Toggle`, `Sidebar`, `TopBar`, `Skeleton`, `EmptyState`,
`SplitCard`, etc. Before creating a component, check the kit. If a primitive almost
fits, **compose over it** (e.g. `PasswordInput` wraps `Input` and adds the toggle) —
never re-implement.

## 8. Folder structure (by type/domain first, then feature)
```
finco-web/src/
  main.tsx              # root: QueryClientProvider + BrowserRouter + AppRouter
  AppRouter.tsx         # top-level router (NOT App.tsx - see gotcha below)
  colors_and_type.css   # design tokens, imported once
  constants/            # api-routes.ts, routes.ts, messages.ts, upload.ts, ...
  types/                # ApiResponse<T>, Client, Period, FileItem, DocumentRequest, User
  mocks/                # fixtures.ts, delay.ts
  services/             # one *.service.ts per domain -> ApiResponse<T>
  hooks/                # React Query per domain + queryKeys.ts, unwrap.ts
  contexts/             # AuthContext, RequestModalContext
  components/            # reusable UI kit, each in its own folder (.tsx + .css)
  pages/                # one folder per screen (.tsx + .css); screen-local parts stay here
  surfaces/             # InternalApp/ (cabinet container + auth gate) + PublicApp/
  utils/                # formatPeriodLabel, etc.
```
Screen-local composites (e.g. `KpiCard`, `ClientRow`, `LotGroup`, `FileRow`,
`ClientPicker`, `DropZone`) stay with their screen; only promote to `components/`
if reused across screens (like `SplitCard`).

## 9. Auth gate (cabinet only)
`AuthContext` wraps the cabinet surface (clients have no account). Two-phase gate in
`InternalApp`: while `isHydrating`, show a splash (not LoginScreen, to avoid a login
flash); after hydration, `!authed` -> LoginScreen, else Shell + routed screen. Mock
auth persists an `authed` flag in `localStorage`. The real token would be an httpOnly
cookie — never in JS.

## 10. Gotchas
- **macOS case-insensitive FS:** do not have both `App.tsx` and an `app/` folder —
  that's why the router root is `AppRouter.tsx` and surface containers live in
  `surfaces/`.
- `formatPeriodLabel("2026-05") -> "mai 2026"` (Romanian month names, no diacritics).
- Files group by `lot` (sort keys ascending). File-type colors: pdf red, xls green,
  img blue, zip orange.
- Request `tip` is derived, not stored: `automat` -> "automat";
  `!automat && created_by === 'public'` -> "public"; else "custom".
- StatusPill keeps its text, never color-only (a11y).
- Verify with `npm run build` and `npx tsc --noEmit` (both must pass clean).
