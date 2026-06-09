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
import { API_ROUTES } from '@constants/api-routes';
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
(e.g. `pages/public/Login/Login.tsx` + `pages/public/Login/Login.css`), imported only
by that file. Shared design tokens stay in `colors_and_type.css`. Do not port the
prototype's inline `style={{...}}` — translate them to CSS using tokens.

## 7. Three places a component can live — pick by reuse
A component belongs to exactly one of three tiers. Decide by **how widely it is reused**:

1. **Shared UI kit — `src/components/`** (barrel: `components/index.ts`): generic,
   domain-agnostic primitives reused across many screens. The kit is grouped into
   **functional subfolders** — never dump a primitive flat at the kit root:
   - `forms/` — `Field`, `Input`, `PasswordInput`, `Textarea`, `Toggle`
   - `buttons/` — `Button`, `IconButton`
   - `layout/` — `Sidebar`, `TopBar`, `Modal` (generic primitive), `Card`, `SplitCard`
   - `feedback/` — `Toast`, `ToastProvider`, `Skeleton`, `EmptyState`, `StatusPill`, `Badge`
   - `media/` — `Icon`, `Logo` (+ `FincoMark`), `Avatar`
   - `navigation/` — `Tabs`
   - `modals/` — cross-screen app modals built on the `Modal` primitive
     (`ClientFormModal`, `RequestDocumentsModal`)
   - `Seo/` stays at the kit root (head/meta helper, no bucket).
   A new primitive goes into the matching bucket; create a new bucket only when a
   primitive genuinely fits none. The barrel re-exports everything, so consumers
   always import from `@components` (see §11) — they never reference a bucket path.
2. **Feature-specific — `src/features/<surface>/<Page>/`**: a component that is NOT a
   page but is specific to ONE screen (e.g. `PeriodRow` belongs only to `ClientDetail`,
   `LotGroup`/`FileRow` only to `PeriodDetail`, `Hero`/`Contact` only to `Home`). It is
   still a component, so it does NOT live in `pages/`; but it isn't shared, so it does
   NOT pollute the UI kit. `<surface>` mirrors the page split (`private` / `public`),
   `<Page>` matches the page folder name.
3. **The page itself — `src/pages/<surface>/<Page>/`**: only the routable screen
   component lives here (one `.tsx` + `.css` per page, nothing else).

Before creating a component, check the kit. If a primitive almost fits,
**compose over it** (see §7.1 below) — never re-implement. A feature component that
later gets reused by a second screen graduates to the shared UI kit (`components/`).

### 7.1 Base primitive + composition (uniform design)
Each family has **one minimal base primitive** that owns the shared look & behavior
(design, spacing, states, accessibility) and exposes only the essentials. Every
variant **extends that base** instead of re-styling from scratch, so the whole app
stays visually uniform and a design tweak lands in one place.

- The base is as small as possible: e.g. `Input` owns the text-field look (border,
  padding, focus ring, icon slot, error state). `PasswordInput` does **not**
  re-implement any of that — it wraps `Input`, fixing `type` and adding the
  show/hide toggle on top. `IconButton` composes the `Icon` + `Button` look rather
  than styling a new button.
- Build a variant by **wrapping the base and layering on top** (extra props, an
  extra slot, a fixed prop), never by copying the base's CSS into a sibling.
- Reuse the base's prop type: `type PasswordInputProps = Omit<InputProps, "type">`
  keeps the surfaces in sync automatically.
- When you find yourself duplicating a base's styles in another component, stop and
  refactor it to compose over the base instead.

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
  components/           # reusable UI kit, grouped into functional subfolders (.tsx + .css per folder)
    forms/              #   Field, Input, PasswordInput, Textarea, Toggle
    buttons/            #   Button, IconButton
    layout/             #   Sidebar, TopBar, Modal, Card, SplitCard
    feedback/           #   Toast, ToastProvider, Skeleton, EmptyState, StatusPill, Badge
    media/              #   Icon, Logo (+FincoMark), Avatar
    navigation/         #   Tabs
    modals/             #   cross-screen modals (ClientFormModal, RequestDocumentsModal)
    Seo/                #   head/meta helper (kit root, no bucket)
    index.ts            #   barrel — the single public entry (@components)
  pages/                # ONLY routable screens, split public/private, one page per folder
    private/            # require auth: Library, ClientDetail, PeriodDetail, Requests, Settings
    public/             # no auth: Home, Login, Upload, RequestLink
  features/             # page-specific components (NOT pages), mirrors the pages split
    private/            #   ClientDetail/PeriodRow, Library/{ClientRow,KpiCard,SegmentedFilter}, ...
    public/             #   Home/{Hero,About,Contact,...}, Upload/{DropZone,FileTile,...}
  surfaces/             # InternalApp/ (cabinet container + auth gate) + PublicApp/ (+ PublicShell)
  utils/                # formatPeriodLabel, etc.
```

**`pages/` vs `features/` (the rule):**
- `pages/<surface>/<Page>/` holds **only** the routable screen — exactly one
  `.tsx` + `.css`. No sub-components, no modals.
- A screen-local part (a component that isn't a page and isn't reused elsewhere) goes
  in `features/<surface>/<Page>/` — same `<surface>` (`private`/`public`) and `<Page>`
  name as the page it serves. Examples: `KpiCard`, `ClientRow`, `SegmentedFilter`
  (Library), `PeriodRow` (ClientDetail), `LotGroup`, `FileRow` (PeriodDetail),
  `RequestRow` (Requests), `Hero`/`About`/`Contact`/`Services`/`SiteHeader`/`SiteFooter`
  (Home), `DropZone`/`FileTile`/`HeroPanel`/`UploadRightPanel`/`ExpiredPanel`/
  `SuccessPanel` (Upload).
- A page with no specific parts (Login, Settings, RequestLink) gets **no** feature
  folder — it is just the page in `pages/`.
- When a feature component starts being reused by a second screen, promote it to the
  shared UI kit (`components/`), like `SplitCard`.
- `PublicShell` (the public-surface layout wrapper) lives with its surface in
  `surfaces/PublicApp/PublicShell/`, not in `pages/`.

## 9. Auth gate (cabinet only)
`AuthContext` wraps the cabinet surface (clients have no account). Two-phase gate in
`InternalApp`: while `isHydrating`, show a splash (not the Login page, to avoid a login
flash); after hydration, `!authed` -> Login, else Shell + routed screen. Mock
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

## 11. Path aliases (no `../../..` for cross-folder imports)
Every top-level `src/` folder has a `@`-alias. Imports that cross a folder boundary
use the alias; **never** climb with `../../../`. Aliases are defined in **two places,
kept in sync**: `paths` in `tsconfig.app.json` and `resolve.alias` in `vite.config.ts`.

| Alias | Folder | Alias | Folder |
|-------|--------|-------|--------|
| `@components` | `src/components` (barrel) | `@hooks/*` | `src/hooks` |
| `@constants/*` | `src/constants` | `@services/*` | `src/services` |
| `@contexts/*` | `src/contexts` | `@mocks/*` | `src/mocks` |
| `@features/*` | `src/features` | `@types` | `src/types` |
| `@pages/*` | `src/pages` | `@utils` | `src/utils` |
| `@surfaces/*` | `src/surfaces` | | |

Rules:
- **Kit consumers import from the barrel:** `import { Button, Icon } from '@components'`
  — never reach into a bucket (`@components/buttons/Button/Button`) from outside the kit.
- **Inside the kit**, components import siblings by **direct alias path**
  (`@components/media/Icon/Icon`), not the barrel — importing the barrel from within
  would create a cycle. App modals (`components/modals/*`) are not in the barrel, so
  they too are imported by direct path (`@components/modals/.../X`).
- **Co-located files stay relative:** a component's own `./X.css` (and a same-folder
  helper) keep `./` — aliases are only for crossing folders.
- Files at the `src` root (`AppRouter`, `main`) have no alias; import them relatively.
- Adding a new top-level `src/` folder = add the alias to **both** config files.

```ts
// WRONG
import { useClients } from '../../../hooks/useClients';
import { Field } from '../../../components/Field/Field';
// CORRECT
import { useClients } from '@hooks/useClients';
import { Field } from '@components';
```
