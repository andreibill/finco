# FINCO Expert - Specificatii frontend (web)

> Descrierea fiecarei pagini din prototip (`Finco/`), cu functionalitatea,
> componentele, starile si maparea catre API. Documentul completeaza
> [`finco-specs.md`](finco-specs.md) (domeniu + backend) si serveste ca ghid de
> implementare pentru SPA-ul React.
>
> Toate textele UI sunt in **romana fara diacritice**.

## 1. Prezentare generala

Aplicatia web are **doua suprafete** complet separate:

| Suprafata | Cine o foloseste | Auth | Container in prototip |
|-----------|------------------|------|------------------------|
| **Aplicatie cabinet** (intern) | Angajatii cabinetului | Email + parola (JWT) | `InternalApp` |
| **Pagini publice client** | Clientii care incarca fisiere | Fara cont (link tokenizat) | `PublicApp` |

**In prototip nu exista buton de comutare (`SurfaceSwitcher`).** Suprafata se
alege **prin rutare**, pe acelasi server de dezvoltare (`localhost:7070`):

- `localhost:7070/` — paginile publice client (upload prin link tokenizat).
- `localhost:7070/app` — aplicatia cabinet, **inclusiv pagina de login**
  (`/app/login`, `/app/biblioteca`, etc.).

In productie ambele suprafete sunt **un singur build** (un singur `dist/`),
servit de nginx pe **doua subdomenii**:

- `finco.ro` — paginile publice client (upload prin link tokenizat).
- `app.finco.ro` — aplicatia cabinet (login + biblioteca).

Suprafata se alege la runtime din `window.location.hostname` (in prod) sau din
prefixul de ruta (in prototip: `/app/*` → cabinet, restul → public). Fiecare
suprafata se incarca lazy (`React.lazy` + `import()`), deci vizitatorul public
nu descarca bundle-ul aplicatiei interne. nginx serveste acelasi `root` pentru
ambele `server_name`, cu fallback SPA (`try_files $uri $uri/ /index.html`) si
proxy pe `/api/`.

> **Cookie JWT:** scopat pe `app.finco.ro` (host-only), NU pe `.finco.ro`, ca
> sa nu fie trimis odata cu cererile publice de pe `finco.ro`.
>
> **Granita de securitate ramane API-ul (JWT)**, nu hostname-ul: lazy-load-ul
> tine de marimea bundle-ului, nu ascunde date (JS-ul intern e oricum public).

### Fisiere prototip

```text
Finco/
├── index.html                  # bootstrap React (CDN), rutare suprafata (/ vs /app)
├── colors_and_type.css         # design tokens (vezi sectiunea 3)
├── assets/finco-logo.jpg       # logo brand
└── app/
    ├── Primitives.tsx          # UI kit (Button, Input, Card, Modal, ...)
    ├── Shell.tsx               # Logo, Sidebar, TopBar
    ├── Data.tsx                # fixtures (clienti, fisiere, cereri)
    ├── InternalApp.tsx         # container + router intern + SettingsScreen
    ├── LoginScreen.tsx
    ├── LibraryScreen.tsx       # dashboard principal (lista clienti)
    ├── ClientDetailScreen.tsx  # perioadele unui client
    ├── PeriodDetailScreen.tsx  # fisierele unei perioade
    ├── RequestsScreen.tsx      # istoricul cererilor de documente
    ├── RequestDocumentsModal.tsx
    ├── PublicScreens.tsx       # PublicShell, UploadPage, RequestLinkPage
    └── PublicApp.tsx           # container public + SuccessPanel
```

> Prototipul ruleaza React via Babel standalone din CDN, cu primitive expuse pe
> `window`. Implementarea reala este un proiect **Vite + React (TypeScript)**;
> primitivele devin componente importabile, iar fixtures (`Data.tsx`) se
> inlocuiesc cu apeluri React Query catre API.

### Structura la implementare (Vite)

Fisierele se impart **intai pe domeniu/tip** (`pages/`, `components/`, `hooks/`,
`services/`, ...) si **apoi pe feature** in interiorul fiecaruia. Fiecare pagina
si fiecare componenta este **propriul folder**, cu fisierul `.tsx` si fisierul
`.css` dedicat alaturi (vezi regula CSS din §12).

```text
src/
├── pages/                       # cate un folder per ecran (feature)
│   ├── LoginScreen/
│   │   ├── LoginScreen.tsx
│   │   └── LoginScreen.css
│   ├── LibraryScreen/
│   │   ├── LibraryScreen.tsx
│   │   └── LibraryScreen.css
│   ├── ClientDetailScreen/
│   ├── PeriodDetailScreen/
│   ├── RequestsScreen/
│   ├── SettingsScreen/
│   └── public/                  # ecranele suprafetei publice
│       ├── UploadPage/
│       ├── RequestLinkPage/
│       ├── SuccessPanel/
│       └── ExpiredPanel/
├── components/                  # UI kit reutilizabil (fost Primitives.tsx)
│   ├── Button/
│   │   ├── Button.tsx
│   │   └── Button.css
│   ├── Input/                   # ex. PasswordInput extinde Input (§12)
│   ├── Card/
│   ├── Modal/
│   ├── StatusPill/
│   └── ...
├── hooks/                       # hooks React Query per domeniu
├── services/                    # clase de API (folosesc API_ROUTES)
├── constants/                   # tot ce s-ar hardcoda des (vezi §12)
│   ├── api-routes.ts            # API_ROUTES
│   ├── routes.ts                # rute frontend (cabinet /app/*, public)
│   └── ...                      # mesaje, limite, etichete de status etc.
└── colors_and_type.css          # design tokens (importat o data la radacina)
```

Containerele de suprafata (`InternalApp`, `PublicApp`) si shell-ul (`Sidebar`,
`TopBar`, `Logo`) raman componente proprii, fiecare in folderul lui.

## 2. Harta paginilor

Maparea ruta → ecran, pe cele doua suprafete. Drill-down-ul (de unde se ajunge
la o ruta) e notat in dreapta.

> **Prefixul `/app` e doar in prototip.** Pe acelasi origin
> (`localhost:7070`) cabinetul are prefix `/app` ca sa coexiste cu suprafata
> publica. **In prod prefixul dispare**: cabinetul e chiar `app.finco.ro`, deci
> rutele lui sunt la radacina (`app.finco.ro/login`, `/biblioteca`, ...) — exact
> valorile "Ruta (prod)" de la fiecare ecran din §5. Publicul nu are prefix in
> niciun caz. Mai jos sunt aratate rutele de **prototip**.

```text
APLICATIE CABINET   prototip: localhost:7070/app/*   ·   prod: app.finco.ro/* (fara /app)
  /app/login                          LoginScreen        gate: randat doar cat !authed
  ── login ───────────────────────────────────────────────────────────────────
  Shell (Sidebar + TopBar) inconjoara toate rutele de mai jos:
  /app/  (alias /app/biblioteca)      LibraryScreen      ◄ ecran implicit dupa login
  /app/clienti/{id}                   ClientDetailScreen din click pe client in Biblioteca
  /app/clienti/{id}/perioade/{pid}    PeriodDetailScreen din click pe perioada in ClientDetail
  /app/cereri                         RequestsScreen     din Sidebar
  /app/setari                         SettingsScreen     din Sidebar

  Overlay-uri (peste orice ruta de mai sus, nu sunt destinatii de navigare):
    RequestDocumentsModal   deschis din Biblioteca / ClientDetail / PeriodDetail
    Toast                   notificari tranzitorii (~3.2s)

PAGINI PUBLICE   prototip: localhost:7070/*   ·   prod: finco.ro/*
  PublicShell inconjoara ambele rute:
  /upload/{token}                     UploadPage
      stari: valid → uploading → done ►SuccessPanel  |  expired ►ExpiredPanel
  /cere-link                          RequestLinkPage  (link "Cere un link nou")
```

> `SuccessPanel` si `ExpiredPanel` nu sunt rute separate, ci **stari** ale
> `/upload/{token}` (dupa upload, respectiv token expirat). `Clienti` din
> Sidebar e doar un alias catre Biblioteca (acelasi ecran), nu o ruta proprie.

## 3. Sistem de design (`colors_and_type.css`)

Tokens importati o singura data la radacina oricarei suprafete. Regula:
**fara culori sau dimensiuni hardcodate** in afara tokenilor.

- **Brand:** portocaliu `--finco-orange #F26B22` (actiuni primare, accente);
  grafit `--finco-graphite #3D3D3D` (wordmark, text, panou hero public).
- **Neutre:** scara `--neutral-0 … 900` (caldura usoara). Fundal app
  `--bg-app`, suprafete `--bg-surface`, inset `--bg-muted`, hover `--bg-subtle`.
- **Status (semafor upload):** `empty` gri, `partial` ambra, `complete` verde,
  `error` rosu, `info` albastru — fiecare cu varianta `-bg`.
- **Typo:** display `Space Grotesk` (titluri), sans `Manrope` (body/UI), mono
  `JetBrains Mono` (perioade, dimensiuni, timestamp-uri). Clase utilitare
  `.t-display`, `.t-h1..4`, `.t-body`, `.t-label`, `.t-caption`, `.t-overline`,
  `.t-mono`.
- **Spacing** pe baza de 4px, **radii** `sm 6 / md 8 / lg 12 / xl 16 / pill`,
  **shadow** `xs..xl` + `focus`, **motion** `--dur-fast 120ms / base 200ms`.
- **Layout:** `--sidebar-w 248px`, `--topbar-h 60px`, containere
  `narrow 720 / base 1080 / wide 1280`.

## 4. UI kit (`Primitives.tsx`)

Componentele reutilizabile pe care le folosesc toate ecranele:

| Componenta | Rol | Variante / props cheie |
|------------|-----|------------------------|
| `Icon` | iconite Lucide | `name`, `size`, `stroke` |
| `Button` | actiune | `variant`: primary / secondary / ghost / danger / inverse; `size`: sm/md/lg; `iconLeft/Right`; `disabled` |
| `IconButton` | actiune doar-iconita | `name`, `label`, `tone` |
| `StatusPill` | semafor status upload | `status`: empty / partial / complete / error; `size` |
| `Badge` | eticheta scurta | `variant`: neutral / brand / mono (folosit pt. `an_luna`) |
| `Avatar` | initiale client/user | `initials`, `size`, `tone`: orange / graphite |
| `Field` + `Input` | camp formular | `label`, `hint`, `error`, `iconLeft`, focus ring portocaliu |
| `Textarea` | text multi-linie | `rows` |
| `Card` | container suprafata | `padding`, `hoverable` |
| `Modal` | overlay centrat | `title`, `subtitle`, `footer`, `width`, inchidere pe backdrop + `x` |
| `Toast` | notificare tranzitorie | `tone`: ok / warn / err / info; auto-dismiss ~3.2s |
| `Tabs` | filtre tab cu numarator | `tabs[{value,label,count}]` |

Din `Shell.tsx`: `Logo` (wordmark FINCO + "expert"), `FincoMark` (semn SVG),
`Sidebar`, `TopBar`. Din `InternalApp.tsx`: `Toggle` (switch on/off).

---

## 5. Aplicatia cabinet (intern)

### 5.0. Shell-ul (`InternalApp` + `Shell.tsx`)

Doua lucruri distincte:

- **`InternalApp`** — containerul (radacina) suprafetei cabinet. Tine **auth
  gate-ul**, **routerul** `/app/*` si **overlay-urile globale**
  (`RequestDocumentsModal`, `Toast`). Echivalentul lui pe public e `PublicApp`.
  - **Auth gate cu doua faze:**
    1. **`isHydrating`** — la prima incarcare se reface sesiunea din cookie
       (`GET /api/me`, eventual un `POST /api/auth/refresh`). Cat timp e in curs
       se randeaza un **ecran de incarcare** (splash), **nu** `LoginScreen` — ca
       sa nu palpaie login-ul inainte sa stim daca utilizatorul e deja logat.
    2. dupa hidratare: daca `!authed` → `LoginScreen`; altfel → Shell + ecranul
       routat.
- **`Shell`** — **cadrul de layout** care ramane pe ecran in timp ce continutul
  se schimba (app chrome): `Sidebar` fix (stanga) + `main` cu `TopBar` (sus) si
  zona de continut scrollabila. **Nu** e o pagina; doar inconjoara ecranul
  routat. Exporta si piesele din care e compus: `Logo`, `FincoMark`, `Sidebar`,
  `TopBar`.

Routing: in prototip e **pe stare** (`route = {name, client?, period?}`), nu URL
real; la implementare se mapeaza pe rute reale (React Router — vezi tabelul de
rute la fiecare ecran).

**`AuthContext`** — sursa unica de adevar pentru sesiunea cabinetului, montat in
`InternalApp` (provider in jurul intregii suprafete). Nu se aplica suprafetei
publice (clientii nu au cont).

- **Expune:** `user` (sau `null`), `authed`, `isHydrating`, plus actiunile
  `login(credentiale)` si `logout()`.
- **Hidratare:** la montare incearca `GET /api/me` (cu `refresh` la nevoie) ca
  sa stabileasca sesiunea din cookie-ul `httpOnly`; `isHydrating` ramane `true`
  pana se rezolva. Aceasta e faza 1 a auth gate-ului de mai sus.
- **Login / logout:** `login()` apeleaza `POST /api/auth/login` (seteaza
  cookie-urile JWT) si populeaza `user`; `logout()` apeleaza
  `POST /api/auth/logout`, curata `user` si redirectioneaza la ruta de login
  (din `constants/routes.ts` — `/app/login` in prototip, `/login` in prod; vezi
  §2).
- **Tokenul NU sta in context/JS** — traieste in cookie `httpOnly`. Contextul
  tine doar **profilul** si starea derivata (`authed = !!user`).
- **Consumatori:** auth gate-ul (`InternalApp`), cardul de utilizator din
  `Sidebar` (nume, initiale, buton iesire), `LoginScreen` (`login()`), si
  handler-ul global de `401` care, dupa refresh esuat, cheama `logout()`
  (vezi §7).

- **Sidebar** (`--sidebar-w`): logo sus; navigatie (`Biblioteca`, `Clienti`,
  `Cereri trimise`, `Setari`); jos cardul utilizatorului curent (avatar, nume,
  "angajat cabinet", buton iesire). Item activ = wash portocaliu + text
  `--finco-orange-700`.
  - In prototip `Clienti` este alias catre `Biblioteca` (acelasi ecran).
- **TopBar** (`--topbar-h`): breadcrumbs optionale, titlu (display), subtitlu,
  zona de actiuni dreapta (`right`).
- **RequestDocumentsModal**: overlay global, deschis din orice ecran cu un
  client (sau fara, alegand din lista).
- **Toast**: colt dreapta-jos, dispare automat dupa ~3.2s. Folosit la "Link
  trimis", "Perioada marcata ca finalizata" etc.

### 5.1. LoginScreen (`LoginScreen.tsx`)

**Scop:** autentificarea angajatului cu email + parola.

- **Ruta (prod):** `/login`
- **Layout:** card centrat 400px, logo deasupra, footer brand.
- **Continut:** titlu "Conectare cabinet"; `Field` email (icon `mail`,
  autofocus); `Field` parola (`type=password`, icon `eye-off`); buton primary
  `lg` "Conectare" cu stare loading ("Conectare..."); nota de subsol:
  *"Clientii nu au cont. Folosesc doar linkul primit pe email."*
- **Stari:** idle / loading (buton dezactivat). In prototip login-ul reuseste
  mereu dupa ~600ms.
- **API:** `POST /api/auth/login` → set cookies JWT (access + refresh) →
  redirect la Biblioteca. Eroare credentiale → mesaj sub formular (romana fara
  diacritice).
- **De adaugat la implementare:** afisare/ascundere parola (toggle pe iconita
  `eye-off`), validare email, mesaj de eroare server, eventual "am uitat
  parola" (post-MVP).

### 5.2. LibraryScreen — Biblioteca (`LibraryScreen.tsx`)

**Scop:** ecranul principal — lista tuturor clientilor cu statusul de upload pe
**perioada curenta**. Punctul de plecare pentru drill-down si pentru cereri.

- **Ruta (prod):** `/` sau `/biblioteca`
- **TopBar:** titlu "Biblioteca", subtitlu "Perioada curenta: {luna}", actiune
  dreapta buton ghost "Notificari".
- **Continut:**
  1. **Banda KPI** (4 carduri `KpiCard`):
     - Clienti incarcat (status `complete`) — `value / total`.
     - Partial (au incarcat, neinchis).
     - Fara upload.
     - Fisiere primite (suma fisierelor in perioada curenta).
  2. **Toolbar:** `Input` cautare (nume/email, icon `search`),
     `SegmentedFilter` (Toate / Fara upload / Partial / Incarcat), buton
     secondary "Adauga client", buton primary "Cere fisiere" (deschide modalul
     fara client preselectat).
  3. **Tabel clienti** (`ClientRow`): coloane *Client* (avatar grafit + nume +
     email), *Status {luna}* (`StatusPill`), *Ultim upload* (mono), *Fisiere*,
     *Zi trimitere*, *actiuni*. Rand clickabil → ClientDetailScreen. In coloana
     de actiuni: buton "Cere fisiere" (deschide modalul cu clientul respectiv)
     si un `IconButton` meniu (`more-horizontal`). Empty state cand filtrele nu
     potrivesc niciun client.
- **Stare in URL:** `search` si `statusFilter` traiesc in query params
  (`?cauta=...&status=partial`), conform regulii din §12 — sursa de adevar e
  URL-ul. Filtrarea e client-side in prototip; in prod se face server-side cu
  aceiasi parametri.
- **API:** `GET /api/clients` (lista + status pe perioada curenta + numar
  fisiere + ultim upload + zi_trimitere). "Adauga client" → `POST /api/clients`
  (modal de adaugare — **de proiectat**, nu exista in prototip). KPI-urile se
  pot deriva din lista sau dintr-un endpoint de sumar.
- **De adaugat:** modal/ecran "Adauga client" si meniul `more-horizontal`
  (editeaza, dezactiveaza, cere fisiere).

### 5.3. ClientDetailScreen — Client (`ClientDetailScreen.tsx`)

**Scop:** profilul unui client + lista perioadelor lui (lunile cu documente).

- **Ruta (prod):** `/clienti/{id}`
- **TopBar:** titlu = numele clientului; breadcrumbs `Biblioteca › {client}`;
  actiune dreapta "Inapoi".
- **Continut:**
  1. **Card antet client:** avatar mare, nume, meta (email, "trimitere lunara:
     ziua {n}", activ/inactiv), actiuni "Editeaza" (secondary) + "Cere fisiere"
     (primary).
  2. **Lista perioade** (`PeriodRow`), sortate descrescator: iconita folder
     colorata dupa status, eticheta luna (`mai 2026`) + `Badge` mono
     (`2026-05`), "Ultim upload: ..." / "Fara upload", numar fisiere,
     `StatusPill`, chevron. Rand clickabil → PeriodDetailScreen.
- **API:** `GET /api/clients/{id}` + `GET /api/clients/{id}/periods`. "Editeaza"
  → `PUT /api/clients/{id}` (modal de editare — **de proiectat**: nume, email,
  activ, zi_trimitere). "Cere fisiere" → RequestDocumentsModal (client
  preselectat).
- **Helper:** `formatPeriodLabel(an_luna)` → "mai 2026".

### 5.4. PeriodDetailScreen — Perioada (`PeriodDetailScreen.tsx`)

**Scop:** fisierele primite pentru o **luna** a unui client, grupate pe **lot**
de upload.

- **Ruta (prod):** `/clienti/{id}/perioade/{periodId}` (sau
  `/perioade/{periodId}`)
- **TopBar:** titlu "Perioada {luna}"; breadcrumbs `Biblioteca › {client} ›
  {an_luna}`; "Inapoi".
- **Continut:**
  1. **Card antet perioada:** iconita folder; titlu + `Badge` mono +
     `StatusPill` (lg); meta: nume client, "{n} fisiere primite", "{n} loturi
     de upload", "ultim upload {timestamp}". Actiuni: "Descarca ZIP"
     (secondary), "Cere fisiere" (secondary), si — daca `!finalizat` — "Marcheaza
     ca finalizat" (primary, icon `check`).
  2. **Fisiere grupate pe lot** (`LotGroup`): antet lot (Lot N, badge cu numar
     fisiere, timestamp, buton ghost "Descarca lotul") + card cu randuri
     `FileRow`. Fiecare `FileRow`: iconita colorata dupa tip (pdf/xls/img/zip),
     nume fisier, "dimensiune · TIP", actiuni `IconButton` vezi / descarca /
     meniu.
  3. **Empty state:** cand nu exista fisiere — iconita, mesaj "Niciun upload
     pentru aceasta perioada" + buton "Cere fisiere".
- **Logica:** fisierele se grupeaza dupa `f.lot`; cheile se sorteaza crescator.
  `numar_lot` distinge loturile (vezi `finco-specs.md` §8 `upload`).
- **API:** `GET /api/periods/{id}/files`; descarcari:
  `GET /api/files/{id}/download` (fisier), `GET /api/periods/{id}/download`
  (ZIP intreaga perioada), iar "Descarca lotul" presupune un endpoint per lot
  (**de adaugat** sau filtru pe download-ul de perioada). "Marcheaza ca
  finalizat" → setare `period.finalizat = true` (endpoint **de adaugat**, ex.
  `PUT /api/periods/{id}/finalizat`) → Toast de confirmare.
- **Tipuri fisier** (`FILE_TYPE_STYLES`): pdf (rosu), xls (verde), img
  (albastru), zip (portocaliu). "vezi" = preview (post-MVP / inline pentru
  pdf/img).

### 5.5. RequestsScreen — Cereri trimise (`RequestsScreen.tsx`)

**Scop:** istoricul tuturor email-urilor cu link de upload (jurnalul
`document_request`): lunar automat, custom (angajat), public (re-cerere).

- **Ruta (prod):** `/cereri`
- **TopBar:** titlu "Cereri trimise", subtitlu "Istoricul email-urilor cu link
  de upload."
- **Continut:** `Tabs` cu numaratoare — *Toate / Lunar automat / Custom
  (angajat) / Public (re-cerere) / Esuate*; tabel cu coloane *Status* (trimis
  verde / esuat rosu), *Client*, *Subiect* (mono), *Perioada* (badge), *Tip*
  (eticheta colorata automat/custom/public), *Trimis de* (sistem / nume angajat
  / public), *Data* (mono).
- **Logica tip cerere** (derivata, nu stocata): `automat` → "automat";
  `!automat && created_by==='public'` → "public"; altfel → "custom" (vezi
  `finco-specs.md` §8).
- **Stare in URL:** tab-ul activ traieste in query param (`?tab=esuate`),
  conform regulii din §12 — partajabil, rezista la refresh.
- **API:** `GET /api/document-requests` (global) sau
  `GET /api/clients/{id}/document-requests` (per client). Filtrarea pe tip /
  status ideal server-side. Pentru cele `esuate` se poate afisa `eroare` (ex.
  tooltip / rand expandabil — **de adaugat**).

### 5.6. SettingsScreen — Setari (in `InternalApp.tsx` in prototip; extras in `pages/SettingsScreen/` la implementare)

**Scop:** profilul angajatului si comutatorul de notificari.

- **Ruta (prod):** `/setari`
- **Continut (max 720px):**
  1. **Card Profil:** `Field` Nume, `Field` Email (read-only in prototip).
  2. **Card Notificari:** rand cu "Email la upload nou" + descriere + `Toggle`.
- **API:** `GET /api/me`; `PUT /api/me/notifications` la schimbarea toggle-ului.
  Editarea profilului (nume/parola) — **de proiectat** post-MVP.

### 5.7. RequestDocumentsModal — Cere fisiere (`RequestDocumentsModal.tsx`)

**Scop:** compunerea unei cereri custom de documente catre un client (genereaza
link nou + trimite email). Vizeaza **luna curenta** (MVP).

- **Trigger:** din Biblioteca (cu/fara client), ClientDetail, PeriodDetail.
- **Continut:**
  - Daca nu vine cu client → `ClientPicker` (dropdown cu cautare vizuala din
    lista de clienti).
  - Card de confirmare client (avatar, nume, email, badge perioada).
  - `Field` Subiect (preumplut: `[FINCO] Fisiere suplimentare — {luna}`).
  - `Field` Mesaj (`Textarea`, preumplut cu un template; hint: "Linkul de
    upload se ataseaza automat la finalul mesajului.").
  - Banner informativ portocaliu: "Linkul va fi valid 14 zile..."
  - Footer: "Anuleaza" + "Trimite link" (dezactivat pana exista client +
    subiect; stare "Se trimite...").
- **API:** `POST /api/document-requests` cu `client_id`, `subiect`, `mesaj`
  (perioada = luna curenta). La succes → inchide modal + Toast "Link trimis
  catre client." In prototip dureaza ~700ms si reuseste mereu.
- **Decizii deschise** (vezi `finco-specs.md` §15): template predefinit vs.
  text liber; durata reala a scadentei (prototip arata 14 zile).

### 5.8. ClientFormModal — Adauga / Editeaza client *(de implementat)*

**Scop:** adaugarea unui client nou si editarea unuia existent. Nu exista in
prototip (butoanele "Adauga client" si "Editeaza" sunt inca fara actiune), dar
e **critic pentru MVP** — fara el nu se poate inrola un client.

- **Trigger:** "Adauga client" (toolbar Biblioteca) → mod **adaugare**;
  "Editeaza" (antet ClientDetail) → mod **editare** (campuri preumplute).
- **Continut** (`Modal`, ~520px):
  - `Field` Nume — obligatoriu.
  - `Field` Email — obligatoriu, format valid, unic. Hint la editare: este
    adresa cu care clientul cere link din formularul public.
  - `Field` Zi trimitere — numar **1-28** (ca sa existe in orice luna; vezi
    `finco-specs.md` §8). Select sau input numeric.
  - `Toggle` Activ — implicit pornit la adaugare.
  - Footer: "Anuleaza" + "Salveaza" (dezactivat cat timp campurile sunt
    invalide; stare "Se salveaza...").
- **Validari client (UX):** nume nevid; email format valid; zi in 1-28.
- **API:** adaugare `POST /api/clients`; editare `PUT /api/clients/{id}`. La
  succes → inchide modal + Toast + invalidare query lista clienti. Email
  duplicat → eroare pe `Field` email (mesaj in romana fara diacritice).
- **De retinut:** in MVP nu exista **stergere** de client (doar dezactivare prin
  `activ = false`). Perioadele **nu** se creeaza din UI — apar din jobul lunar
  sau la primul upload (vezi `finco-specs.md` §9.1).

---

## 6. Pagini publice (client)

Container `PublicApp`. Starile publice (upload / expirat / cere link / dupa
upload) se ating **prin rutare**, nu printr-un switcher in footer:
`/upload/{token}`, `/cere-link`, etc. In productie pagina se determina din
token-ul din URL si din starea uploadului; in prototip se navigheaza la
aceleasi rute pe `localhost:7070`.

`context` (mock in prototip; real din `GET /api/public/upload/{token}`):
`companyName`, `period` (`2026-05`), `periodLabel`, `expira_la`, `expired`,
`expiredAt`.

### 6.0. PublicShell (`PublicScreens.tsx`)

Cadru comun: fundal cu glow portocaliu radial, header (logo + link "Cere un
link nou"), main centrat (max 960px), footer brand. Mesaj cheie:
*"linkul este criptat si valabil pentru un singur client"*.

### 6.1. UploadPage (`PublicScreens.tsx`)

**Scop:** clientul incarca **o singura arhiva .zip** cu documentele lunii.

- **Ruta (prod):** `finco.ro/upload/{token}`
- **Layout split-card:** stanga `HeroPanel` grafit (luna mare tipografic +
  `an_luna` mono, nume firma, meta: Termen limita / Format acceptat / Re-upload
  acelasi link); dreapta `UploadRightPanel`.
- **UploadRightPanel:** "Pas 1 din 1", titlu "Incarcati fisierele lunii {luna}";
  chip-uri (`.zip`, "Foldere ok", "max 50 MB", "Re-upload pana la scadenta");
  `DropZone` (drag & drop sau click → input `accept=.zip`); dupa selectie
  `FileTile` (nume, dimensiune, bara de progres, buton elimina); buton mare
  "Trimite catre cabinet" (→ "Se incarca... {n}%" → "Incarcat"); nota de subsol
  despre verificarea pe server.
- **Validari client (UX, nu inlocuiesc backend-ul):** extensie `.zip`; limita
  50 MB; un singur fisier. Eroarea apare ca `Toast` tone err. Vezi
  `finco-specs.md` §9.2.
- **Stari:** fara fisier (DropZone) → fisier selectat (FileTile) → uploading
  (progres, buton dezactivat, anti dublu-submit) → done → `SuccessPanel`.
  `expired` → `ExpiredPanel`.
- **API:** `GET /api/public/upload/{token}` (valideaza token, returneaza
  context + scadenta) → `POST /api/public/upload/{token}` (multipart ZIP, cu
  progres). Backend dezarhiveaza, stocheaza, seteaza `are_upload=true`,
  notifica angajatii.

### 6.2. ExpiredPanel (in `PublicScreens.tsx`)

Cand token-ul e expirat: split-card cu mesaj "Link expirat" (data expirarii) +
buton "Cere un link nou" → duce la RequestLinkPage.

### 6.3. SuccessPanel (in `PublicApp.tsx` in prototip; extras in `pages/public/SuccessPanel/` la implementare)

**Scop:** confirmarea uploadului reusit.

- Split-card cu hero **verde** ("Multumim.", nume firma, perioada), dreapta
  "Upload finalizat" + "Fisierele au fost primite" + cardul arhivei incarcate +
  mentiune ca se poate reveni cu fisiere suplimentare pe acelasi link pana la
  `expira_la`. Actiuni: "Incarca alte fisiere" (revine la UploadPage) +
  "Inchide".

### 6.4. RequestLinkPage (`PublicScreens.tsx`)

**Scop:** clientul care a pierdut email-ul cere singur un link nou.

- **Ruta (prod):** `/cere-link` (sau link "Cere un link nou" din shell/expired)
- **Continut:** card centrat (max 480px), iconita, titlu "Cere un link nou",
  `Field` Email (autofocus), buton "Trimite link nou" (stare "Se trimite...").
  Dupa trimitere → stare de succes generica: "Verificati casuta de email. /
  Daca adresa este inregistrata, veti primi imediat un link nou..." Nota de
  subsol despre limitarea cererilor (rate limiting).
- **Securitate:** raspuns **generic** indiferent daca email-ul exista
  (anti-enumerare), rate limiting pe IP + email (vezi `finco-specs.md` §11).
- **API:** `POST /api/public/request-link` cu `email`. Validare minima client:
  contine `@`.

---

## 7. Stari transversale (loading / eroare / empty / sesiune)

Reguli valabile pe **toate** ecranele interne, peste starile happy-path
descrise mai sus. Sursa de adevar e React Query.

- **Loading:** liste si tabele afiseaza **skeleton** (randuri placeholder) cat
  timp `isLoading`; refetch-ul (`isFetching`) arata un indicator discret, fara
  a goli continutul. Butoanele cu actiune au stare de asteptare (deja in
  prototip: "Conectare...", "Se trimite...", "Se salveaza...").
- **Eroare API:** raspunsurile sunt `ApiResponse<T>`, deci `message` e gata de
  afisat (romana fara diacritice). Erori de mutatie → `Toast` tone `err`; erori
  de incarcare a unui ecran → stare de eroare in continut cu buton "Reincarca".
- **Empty states:** (1) global — niciun client inca → mesaj + CTA "Adauga
  client"; (2) per filtru — deja in prototip ("Niciun client nu corespunde
  filtrelor"); (3) perioada fara fisiere — deja in prototip.
- **Sesiune / auth:** token JWT in cookie `httpOnly` (nu in JS). La `401` pe
  orice request → o singura incercare de `POST /api/auth/refresh`; daca esueaza
  → `AuthContext.logout()` (curatare stare + redirect la ruta de login din
  `constants/routes.ts`; vezi §2 pentru prefixul `/app`). Tratat global
  (interceptor / handler `onError` React Query). Logout manual →
  `POST /api/auth/logout` + acelasi redirect.
- **Invalidare:** dupa orice mutatie (cere fisiere, marcheaza finalizat,
  adauga / editeaza client, toggle notificari) se invalideaza query-urile
  afectate, ca UI-ul sa reflecte starea reala fara reload manual.

## 8. Responsive

- **Aplicatia cabinet** este **desktop-first** (tinta principala ≥ 1024px).
  Sub acest prag: `Sidebar` devine drawer cu buton hamburger; tabelele
  (`ClientRow`, `RequestsScreen`) raman scrollabile orizontal (deja
  `overflowX: auto`) sau colapseaza in liste de carduri pe ecrane mici;
  toolbar-ul se aseaza pe mai multe randuri (deja `flexWrap`).
- **Paginile publice** trebuie sa functioneze bine pe **mobil** — clientii
  incarca frecvent de pe telefon. `SplitCard` (grid `380px + 1fr`) **se
  stivuieste vertical** sub ~720px (hero deasupra, zona de upload dedesubt).
  `DropZone` ramane tap-friendly, butonul principal e full-width (deja).
  `RequestLinkPage` (max 480px) e deja potrivit pentru mobil.
- **Breakpoints sugerate:** `sm 480 / md 768 / lg 1024 / xl 1280` (aliniate la
  containerele din tokens). Tinte de atingere ≥ 44px.

## 9. Accesibilitate

- **Modal:** focus trap, focus pe primul camp la deschidere, return focus la
  trigger la inchidere, `Esc` inchide (pe langa click pe backdrop),
  `role="dialog"` + `aria-modal` + `aria-labelledby` legat de titlu.
- **IconButton:** are deja `aria-label` (prop `label`) — obligatoriu pe toate
  butoanele doar-iconita (vezi, descarca, meniu, iesire).
- **Randuri clickabile** (`ClientRow`, `PeriodRow`): nu doar `onClick` pe `tr`/
  `div` — fac numele un element focusabil (buton/link) cu activare pe `Enter`,
  pentru navigare la tastatura.
- **Focus vizibil:** ringul portocaliu (`--shadow-focus`) exista pe `Input`;
  se extinde la butoane si linkuri via `:focus-visible`.
- **StatusPill** nu transmite informatia **doar prin culoare** — pastreaza
  mereu textul ("partial", "incarcat" etc.) alaturi de bulina.
- **Contrast:** se verifica AA pentru textul de status pe fundalul `-bg`
  (ex. partial `#8B5E0A` pe `#FFF6E6`).
- **Formulare:** `Field` leaga `label` de input (deja prin `<label>` wrap);
  erorile se leaga via `aria-describedby`.
- `<html lang="ro">`. Upload-ul ofera si alternativa la drag & drop (input file
  focusabil), deja prezenta.

## 10. Mapare ecran → endpoint (rezumat)

| Ecran / actiune | Metoda + endpoint |
|-----------------|-------------------|
| Login | `POST /api/auth/login`, `POST /api/auth/refresh`, `POST /api/auth/logout` |
| Biblioteca (lista + status) | `GET /api/clients` |
| Adauga / editeaza client | `POST /api/clients`, `PUT /api/clients/{id}` |
| Detaliu client | `GET /api/clients/{id}`, `GET /api/clients/{id}/periods` |
| Detaliu perioada (fisiere) | `GET /api/periods/{id}/files` |
| Descarcare fisier / perioada | `GET /api/files/{id}/download`, `GET /api/periods/{id}/download` |
| Marcheaza finalizat | `PUT /api/periods/{id}/finalizat` *(de adaugat)* |
| Cereri trimise | `GET /api/document-requests`, `GET /api/clients/{id}/document-requests` |
| Cere fisiere (custom) | `POST /api/document-requests` |
| Setari / notificari | `GET /api/me`, `PUT /api/me/notifications` |
| Public — context link | `GET /api/public/upload/{token}` |
| Public — upload ZIP | `POST /api/public/upload/{token}` |
| Public — cere link nou | `POST /api/public/request-link` |

Toate raspunsurile folosesc `ApiResponse<T>` (`status / message / data`).

## 11. De decis / de proiectat la implementare

- **Meniul `more-horizontal`** din randul de client (actiuni rapide:
  editeaza, dezactiveaza, cere fisiere).
- **Endpoint si confirmare** pentru "Marcheaza ca finalizat" si pentru
  "Descarca lotul".
- **Preview fisier** ("vezi") — inline pentru pdf/img (post-MVP).
- **Afisarea erorii** pentru cererile esuate in RequestsScreen.
- **Toggle vizibilitate parola** + flux "am uitat parola" (post-MVP).
- **Rutare reala** (URL-uri, ex. React Router) in locul router-ului pe stare
  din prototip. Modelul de deploy (un build, doua subdomenii via nginx) e
  descris in §1.
- **Decizii din `finco-specs.md` §15:** template email custom, durata scadentei
  (prototip 14 zile), limita ZIP (prototip 50 MB), politica de retentie.

## 12. Conventii de implementare (din regulile proiectului)

- **Stack:** SPA construit cu **Vite + React** (TypeScript), routing cu React
  Router, state server cu React Query.
- Texte UI in **romana fara diacritice**.
- **Nimic hardcodat — totul ce se repeta sta in fisiere de constante.** Orice
  valoare care apare in mai multe locuri sau risca sa fie scrisa de mai multe
  ori se centralizeaza intr-un fisier dedicat din `constants/`, niciodata inline
  in componente. Fisiere asteptate:
  - `constants/api-routes.ts` — rutele API (`API_ROUTES`).
  - `constants/routes.ts` — rutele frontend (cabinet `/app/*`, public).
  - `colors_and_type.css` — culori + tipografie (design tokens).
  - alte constante recurente (mesaje, limite, etichete de status, optiuni de
    select etc.) — fiecare in fisierul lui din `constants/`.
- **Fara rute API hardcodate** — definite centralizat (`API_ROUTES`).
- **Fara culori hardcodate** — doar tokens din `colors_and_type.css`.
- **Toate apelurile** catre backend prin **React Query** (`useQuery` /
  `useMutation`).
- **Filtrarea, cautarea, tab-urile si paginarea stau in URL** (query params),
  nu doar in state local. Ex.: `?cauta=...&status=partial`,
  `/app/cereri?tab=esuate`. Astfel starea e **partajabila, bookmarkabila si
  rezista la refresh / back-forward**, iar React Query foloseste aceiasi
  parametri drept cheie de query (refetch automat la schimbarea filtrului).
  URL-ul e sursa de adevar pentru filtre; componenta il citeste, nu tine o copie
  separata.
- **CSS simplu (plain CSS), fara Tailwind sau alte librarii de stilizare.**
  Fiecare pagina are **propriul fisier CSS** dedicat (ex. `LoginScreen.css`
  langa `LoginScreen.tsx`), importat doar de pagina respectiva. Stilurile
  partajate raman in `colors_and_type.css` (tokens) si in CSS-ul componentelor
  reutilizabile.
- **Reutilizeaza componentele, nu crea altele noi.** Inainte de a crea o
  componenta, verifica daca exista deja una in UI kit (`Primitives.tsx`) care
  acopera cazul. Daca o componenta existenta nu acopera complet cazul,
  **extinde-o** (compune peste ea), nu duplica: ex. `PasswordInput` se
  construieste peste `Input`/`TextInput` (adauga doar toggle-ul de
  vizibilitate), nu se rescrie de la zero.
- Componente reutilizabile (UI kit din `Primitives.tsx`) separate de
  componente specifice de ecran.
