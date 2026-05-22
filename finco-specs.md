# FINCO - Specificatii aplicatie

> Biblioteca de fisiere lunare pentru un cabinet de contabilitate.

## 1. Context si problema

Cabinetul de contabilitate primeste lunar documente de la clientii sai (facturi,
extrase, bonuri etc.). Problema actuala: fiecare client trimite fisierele pe alt
canal — unii pe WhatsApp, altii pe email, altii pe alte cai. Nu exista un loc
unic, angajatii pierd timp adunand fisiere si nu au vizibilitate asupra a ceea
ce s-a primit si ce lipseste.

**FINCO** rezolva asta oferind o **biblioteca centralizata de fisiere per
client**, in care fisierele ajung intotdeauna prin acelasi flux: un link de
upload trimis pe email.

## 2. Obiective

- Un singur loc unde angajatul vede toate fisierele fiecarui client, pe luni.
- Clientul incarca fisierele printr-un **link de upload** primit pe email (fara
  cont, fara login).
- Backend-ul dezarhiveaza automat ZIP-ul si afiseaza fisierele in biblioteca.
- Angajatul poate cere fisiere suplimentare printr-un email cu link de upload.
- Clientul care a uitat sa incarce poate cere singur un link nou, dintr-o
  pagina publica, introducandu-si email-ul.
- Angajatul vede **statusul de upload** pentru fiecare client si primeste
  **notificari pe email** cand un client incarca un fisier.

## 3. Decizii confirmate

| Aspect | Decizie |
|--------|---------|
| Tenancy | **Un singur cabinet** (instrument intern, fara izolare multi-tenant) |
| Stocare fisiere | **Object storage (S3 / MinIO)**; Postgres tine doar metadatele |
| Trimitere email | **SMTP** la inceput, ascuns in spatele unei interfete `EmailSender` (furnizor schimbabil din config) |
| Autentificare angajati | **Email + parola (JWT)**. Clientii NU au cont — folosesc doar link-uri tokenizate |
| Expirare link upload | **Refolosibil pana la scadenta configurabila**; email pierdut -> re-cerere din pagina publica. Fara expirare la upload, fara buton de finalizare pentru client |

## 4. Stack tehnic

- **Backend:** Java + Spring Boot (REST API)
- **Frontend:** React (SPA)
- **Baza de date:** PostgreSQL (metadate, utilizatori, clienti, perioade, tokenuri)
- **Stocare fisiere:** Object storage compatibil S3 (MinIO in dev/local, S3 in prod)
- **Email:** SMTP prin interfata `EmailSender` (implementare schimbabila)
- **Auth:** JWT (access + refresh), parole hashuite (BCrypt)

## 5. Actori si roluri

| Actor | Descriere | Autentificare |
|-------|-----------|---------------|
| **Angajat cabinet** (user) | Foloseste aplicatia: vede biblioteca, cere fisiere, primeste notificari | Email + parola (JWT) |
| **Client** | Firma deservita de cabinet. Doar incarca fisiere prin link | Fara cont — link tokenizat / formular public |
| **Sistem** | Joburi automate: emitere link-uri lunare, dezarhivare, notificari | — |

> Pentru inceput nu se face distinctie de roluri intre angajati (toti au acces
> complet). Un model de roluri (admin / operator) e lasat pentru o etapa
> ulterioara.

## 6. Concepte de domeniu (glosar)

- **Client** — firma care trimite fisiere. Are nume, email, status activ si o
  **zi de trimitere** proprie (ziua din luna in care primeste automat email-ul
  lunar).
- **Perioada (luna)** — luna calendaristica pentru care se aduna documente
  (ex. `2026-05`).
- **Upload** — o incarcare efectiva (un ZIP) facuta de client printr-un link.
- **Fisier** — un fisier individual rezultat din dezarhivarea unui ZIP.
- **Link de upload** — URL public cu token unic, cu scadenta, asociat unui
  client si unei perioade.
- **Cerere de documente (`document_request`)** — inregistrarea unui email cu
  link de upload trimis catre client. Acopera **toate** email-urile cu link:
  lunar automat, ad-hoc / custom (de catre angajat) si re-cerere din formularul
  public. Retine si rezultatul trimiterii (trimis / esuat).
- **Status de upload** — stare derivata din flag-urile perioadei
  (`are_upload`, `finalizat`): niciun upload / partial (a incarcat ceva) /
  incarcat (angajatul a marcat perioada finalizata). Fara validare de fisiere
  obligatorii in aceasta etapa.

## 7. Arhitectura backend

### 7.1. Organizare pe domeniu (regula generala)

- Codul este organizat **pe domeniu**, nu pe strat tehnic. Nu exista pachete
  globale de tip `controller/` sau `repository/` care aduna toate clasele.
- Fiecare domeniu (ex. `client`, `period`, `uploadlink`, `upload`, `file`,
  `documentrequest`, `auth`, `notification`) este un pachet de sine statator care
  isi contine **propriul** `Controller`, `Orchestrator`, `Service`,
  `Repository`, entitate si DTO-uri.
- Componentele cross-cutting (trimitere email, client object storage,
  `ApiResponse` / exceptii comune, configurari) stau in pachete dedicate
  (`email`, `storage`, `common`, `config`).
- Orchestratorul traieste in pachetul domeniului sau principal, chiar daca
  foloseste Service-uri din alte domenii.

### 7.2. Reguli de flux intre straturi

```text
Controller  ->  Orchestrator  ->  Service  ->  Repository
```

- **Controller** — doar HTTP (request/response, validare input). Apeleaza doar
  Orchestratori.
- **Orchestrator** — coordoneaza fluxul unui caz de utilizare; aici se face
  coordonarea cross-domeniu (poate folosi Service-uri din mai multe domenii).
- **Service** — logica de business pe un singur domeniu; apeleaza **doar**
  propriul Repository. Un Service nu apeleaza alt Service.
- **Repository** — acces la date pentru o singura entitate.

Toate raspunsurile API folosesc formatul standard:

```json
{ "status": "success | error", "message": "...", "data": null }
```

Mesajele catre utilizator sunt in **romana fara diacritice**.

## 8. Model de date (entitati propuse)

### `user` (angajat cabinet)
| camp | tip | note |
|------|-----|------|
| id | UUID | PK |
| email | string | unic |
| parola | string | hash BCrypt |
| nume | string | |
| notificari_active | boolean | primeste email la upload |
| created_at | timestamp | |

### `client`
| camp | tip | note |
|------|-----|------|
| id | UUID | PK |
| nume | string | |
| email | string | unic — folosit la formularul public |
| activ | boolean | |
| zi_trimitere | int | ziua din luna (1-28) in care i se trimite automat email-ul lunar; per client, configurabila |
| created_at | timestamp | |

> `zi_trimitere` este limitata la 1-28 ca sa existe in orice luna. Perioada
> (`an_luna`) este aceeasi pentru toti clientii; doar **ziua trimiterii** difera
> per client.

### `period` (perioada lunara per client)
| camp | tip | note |
|------|-----|------|
| id | UUID | PK |
| client_id | UUID | FK -> client |
| an_luna | string | ex. `2026-05` |
| are_upload | boolean | clientul a incarcat ceva (default `false`) |
| finalizat | boolean | angajatul a marcat perioada ca finalizata (default `false`) |
| created_at | timestamp | |

> Unic pe `(client_id, an_luna)`.
>
> Statusul afisat se deduce din flag-uri: `!are_upload` = niciun upload;
> `are_upload && !finalizat` = partial; `finalizat` = incarcat.

### `upload_link`
| camp | tip | note |
|------|-----|------|
| id | UUID | PK |
| client_id | UUID | FK -> client |
| period_id | UUID | FK -> period |
| token | string | unic, aleator, lung |
| automat | boolean | `true` daca generat de jobul lunar automat; `false` daca on-demand (custom / public) |
| expira_la | timestamp | scadenta |
| folosit | boolean | indicator ca s-a incarcat cel putin o data (pt. angajat); nu afecteaza expirarea |
| created_by | UUID | FK -> user (null daca generat de sistem / formular public) |
| created_at | timestamp | |

### `upload`
| camp | tip | note |
|------|-----|------|
| id | UUID | PK |
| client_id | UUID | FK |
| period_id | UUID | FK |
| upload_link_id | UUID | FK |
| numar_lot | int | numarul lotului in cadrul perioadei (1 = primul upload al lunii, 2 = al doilea ...) |
| nume_zip | string | |
| numar_fisiere | int | |
| created_at | timestamp | momentul incarcarii |

> `numar_lot` distinge loturile aceleiasi perioade si serveste ca namespace
> pentru fisiere intre upload-uri. (Intr-un singur ZIP nu pot exista doua
> fisiere cu acelasi nume, deci coliziunile apar doar intre loturi.)

### `file`
| camp | tip | note |
|------|-----|------|
| id | UUID | PK |
| upload_id | UUID | FK -> upload |
| client_id | UUID | FK (denormalizat pt. filtrare rapida) |
| period_id | UUID | FK |
| nume_fisier | string | calea/numele relativ din ZIP — se **pastreaza** structura de foldere |
| cale_storage | string | cheia unica in object storage (UUID), **nederivata** din `nume_fisier` |
| dimensiune | long | bytes |
| content_type | string | |
| created_at | timestamp | |

### `document_request`

Inregistrarea fiecarui email cu link de upload trimis catre client — log unic
pentru lunar automat, custom (angajat) si re-cerere publica.

| camp | tip | note |
|------|-----|------|
| id | UUID | PK |
| client_id | UUID | FK -> client |
| period_id | UUID | FK -> period (nullable pt. custom fara luna) |
| automat | boolean | `true` = email lunar automat; `false` = on-demand (custom / public) |
| subiect | string | subiect email |
| mesaj | text | corpul email-ului (template sau custom) |
| upload_link_id | UUID | FK -> upload_link generat |
| created_by | UUID | FK -> user (null cand `automat=true` sau cand vine din formularul public) |
| email_trimis | boolean | `true` daca trimiterea a reusit, `false` daca a esuat |
| eroare | text | mesaj de eroare cand `email_trimis = false` (nullable) |
| created_at | timestamp | momentul trimiterii |

> Tipul cererii se deduce, nu se stocheaza ca enum: `automat=true` = lunar;
> `automat=false` + `created_by` setat = custom (angajat); `automat=false` +
> `created_by` null = public (formular).

## 9. Fluxuri principale

### 9.1. Ciclul lunar (automat)

1. Un job de sistem ruleaza **zilnic**.
2. Pentru fiecare client activ a carui `zi_trimitere` este egala cu ziua
   curenta din luna (daca luna are mai putine zile, se ruleaza in ultima zi):
   - daca pentru acest client + luna curenta link-ul lunar automat s-a trimis
     deja, se sare peste (idempotent — evita email-uri duble la rulari
     repetate / restart),
   - se creeaza `period` pentru luna curenta daca nu exista deja (`are_upload`
     si `finalizat` = `false`),
   - se genereaza un `upload_link` cu `automat = true` si scadenta
     configurabila (ex. N zile de la trimitere),
   - se trimite email-ul cu link-ul si se inregistreaza un `document_request`
     cu `automat = true` (`email_trimis` = `true` / `false`).

> Link-ul lunar este pentru **luna curenta** (luna in care e trimis). Ziua de
> trimitere este **per client** (`client.zi_trimitere`); perioada (`an_luna`)
> este aceeasi pentru toti, doar ziua emiterii difera. Scadenta ramane
> configurabila, separat de ziua de trimitere.
>
> **Client nou (inregistrat la mijlocul lunii):** daca `zi_trimitere` a trecut
> deja fata de ziua curenta, i se trimite imediat link-ul pentru luna curenta;
> altfel primeste link-ul la `zi_trimitere`, prin jobul zilnic.

### 9.2. Upload de catre client

1. Clientul deschide link-ul. Pagina publica valideaza token-ul (exista,
   neexpirat) si afiseaza **scadenta** (pana cand poate incarca).
2. Clientul selecteaza **un ZIP** cu toate fisierele lunii.
3. Frontend (verificari rapide inainte de trimitere, doar pentru UX — **nu**
   inlocuiesc validarea din backend, care ramane sursa de adevar):
   - exista un fisier selectat si nu e gol,
   - extensia / tipul este `.zip`,
   - dimensiunea se incadreaza in limita configurata (acelasi prag ca
     backend-ul) — altfel eroare imediata, fara a mai trimite request-ul,
   - afiseaza progresul uploadului si dezactiveaza butonul cat timp se trimite
     (evita dublu-submit),
   - mesaje de eroare clare in romana fara diacritice.
4. Backend (`UploadOrchestrator`):
   - valideaza ca e ZIP si limita de dimensiune,
   - dezarhiveaza in siguranta (protectie zip-slip / zip-bomb: limita
     dimensiune totala, numar fisiere, cai relative interzise),
   - urca fiecare fisier in object storage,
   - salveaza `upload` + `file`-uri in Postgres,
   - seteaza `period.are_upload = true` (flag-ul `finalizat` nu se atinge aici),
   - declanseaza notificari catre angajatii cu `notificari_active = true`.
5. Link-ul ramane valid si **refolosibil pana la scadenta configurabila** —
   clientul mai poate adauga fisiere de cate ori vrea pana atunci. Daca pierde
   email-ul cu link-ul, foloseste pagina publica de re-cerere (9.4) pentru un
   link nou. Nu exista buton de finalizare pentru client; flag-ul
   `period.finalizat` este setat de angajat cand inchide perioada.

### 9.3. Cerere de fisiere suplimentare (de catre angajat)

1. Angajatul alege un client; in MVP cererea vizeaza **luna curenta** (fara
   luni trecute).
2. Scrie / alege un mesaj custom (modul exact de compunere se decide ulterior).
3. `DocumentRequestOrchestrator` genereaza un `upload_link` cu
   `automat = false`, trimite email-ul si inregistreaza un `document_request`
   cu `automat = false` si `created_by` = angajatul (= cerere custom).

### 9.4. Re-cerere link de catre client (pagina publica)

1. Clientul intra pe pagina publica si isi introduce email-ul intr-un formular.
2. Daca email-ul exista in `client` (si clientul e activ):
   - se genereaza un nou `upload_link` pentru perioada curenta,
   - se trimite pe email si se inregistreaza un `document_request` cu
     `automat = false` si `created_by` null (= cerere publica).
3. Daca email-ul nu exista: raspuns generic (fara a dezvalui daca exista sau
   nu — anti-enumerare). Rate limiting pe IP + email.

### 9.5. Vizualizare biblioteca (angajat)

- Lista clienti cu statusul de upload pe perioada curenta (semafor).
- Drill-down: client -> perioade -> upload-uri -> fisiere.
- Descarcare fisier individual sau a intregului ZIP/perioada.
- Filtrare dupa luna si dupa status.

### 9.6. Notificari pe email (angajat)

- La fiecare upload reusit, angajatii cu `notificari_active = true` primesc un
  email: „Clientul X a incarcat N fisiere pentru luna AAAA-LL".
- Setarea poate fi dezactivata per utilizator din profil.

## 10. Endpoint-uri API (propunere)

### Public (fara auth, tokenizat)
- `GET  /api/public/upload/{token}` — valideaza link si returneaza context.
- `POST /api/public/upload/{token}` — incarca ZIP-ul.
- `POST /api/public/request-link` — formular email -> trimite link nou.

### Auth angajati
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`

### Clienti
- `GET  /api/clients` — lista + status upload pe perioada curenta.
- `POST /api/clients`
- `GET  /api/clients/{id}`
- `PUT  /api/clients/{id}`

### Biblioteca / fisiere
- `GET  /api/clients/{id}/periods`
- `GET  /api/periods/{id}/files`
- `GET  /api/files/{id}/download`
- `GET  /api/periods/{id}/download` — ZIP cu toata perioada.

### Cereri de documente
- `POST /api/document-requests` — cerere custom catre un client.
- `GET  /api/clients/{id}/document-requests` — istoricul email-urilor trimise
  clientului (lunar / custom / public, cu status trimitere).

### Profil / setari
- `GET  /api/me`
- `PUT  /api/me/notifications` — toggle notificari upload.

## 11. Securitate

- **Link-uri de upload:** token aleator lung (≥ 32 bytes, base64url), scadenta
  obligatorie, asociere stricta client + perioada. Nu se dezvaluie alte date in
  pagina publica decat strictul necesar.
- **Formular public:** raspuns generic (anti-enumerare email), rate limiting pe
  IP si pe email.
- **Upload:** validare tip ZIP, limita dimensiune, protectie zip-slip si
  zip-bomb la dezarhivare, sanitizare nume fisiere.
- **Auth angajati:** JWT access (scurt) + refresh, parole BCrypt.
- **Stocare:** cheile din object storage nu sunt ghicibile; descarcarea se face
  doar prin endpoint autentificat care genereaza URL pre-semnat scurt sau
  streamuieste continutul.
- **Transport:** doar HTTPS.

## 12. Trimitere email (design)

Trimiterea email-urilor este abstractizata in spatele unei interfete
`EmailSender`:

```
interface EmailSender {
    void send(EmailMessage message);
}
```

- Implementare initiala: `SmtpEmailSender` (config: host, port, user, parola,
  from).
- Furnizorul devine un detaliu de configurare — se poate inlocui ulterior cu o
  implementare pentru un serviciu tranzactional (SendGrid / SES / Mailgun) fara
  a modifica logica de business.
- **Nu** ne bazam pe tracking de email (open/click): statusul de upload si
  notificarile vin din evenimentele reale de incarcare din baza de date.

Tipuri de email:
1. Link lunar (automat) — logat in `document_request` (`automat=true`).
2. Cerere custom (initiata de angajat) — logat in `document_request`
   (`automat=false`, `created_by` setat).
3. Re-cerere link (din formularul public) — logat in `document_request`
   (`automat=false`, `created_by` null).
4. Notificare interna catre angajat (upload primit) — **nu** se logheaza in
   `document_request` (nu e adresata clientului, nu contine link de upload).

Orice email cu link de upload catre client (1-3) creeaza un rand in
`document_request` cu rezultatul trimiterii (`email_trimis`), deci tabela este
istoricul complet al comunicarii cu clientul.

## 13. In afara scopului (etapa 1)

- Validare de fisiere obligatorii per luna (ex. „lipseste extrasul").
- Roluri/permisiuni intre angajati.
- Multi-tenant (mai multe cabinete).
- Tracking deschideri/click-uri email.
- Integrari directe cu WhatsApp / alte canale.
- OCR / clasificare automata a documentelor.
- Targetarea lunilor trecute (re-cererea si cererea custom vizeaza doar luna
  curenta).
- Reglaje de deliverability email (SPF / DKIM / DMARC) — se trateaza ulterior.

## 14. Idei / imbunatatiri viitoare

- Configurare de fisiere obligatorii per client si avertizare la lipsa.
- Dashboard cu statistici (rata de raspuns, intarzieri per client).
- Reminder automat catre clientii care nu au incarcat pana la scadenta.
- Template-uri de email gestionabile din UI.
- Audit log (cine a cerut/descarcat ce).
- Roluri: admin vs. operator.
- Export contabil (structurare fisiere pe tip de document).
- Scanare antivirus a fisierelor incarcate (planificata pentru V2).

## 15. Intrebari deschise (de clarificat)

1. **Compunerea email-ului custom** — sablon predefinit cu campuri editabile
   sau text complet liber? (decizie amanata explicit de client)
2. **Scadenta link-urilor** — ce zi/durata? (ex. ziua 15 a lunii vs. N zile de
   la trimitere)
3. **Refolosire link** — DECIS: refolosibil pana la scadenta configurabila;
   email pierdut -> re-cerere din pagina publica.
4. **Setarea flag-ului `finalizat`** — fara buton pentru client; cine/cand il
   seteaza? (propunere: angajatul marcheaza perioada ca finalizata din
   biblioteca)
5. **Limita dimensiune ZIP** si numar maxim fisiere per upload.
6. **Pastrarea fisierelor** — politica de retentie (cat timp se pastreaza
   arhiva veche)?

### De discutat dupa MVP

- Bootstrap primul angajat + flux de resetare parola + management utilizatori.
- GDPR / retentie: regiune de stocare (UE), perioada legala de pastrare vs.
  dreptul la stergere.
- Backup Postgres + object storage (cu plan de restaurare).
- Limite de upload la nivel de infra (multipart Spring, `client_max_body_size`
  in reverse proxy) corelate cu limita ZIP; dezarhivare prin streaming pe disc.
- Timezone fix pentru jobul zilnic / `zi_trimitere` (Europe/Bucharest).
- Pagina publica de upload este doar pentru incarcare (nu listeaza fisierele
  existente ale clientului).

## 16. Etape de livrare (propunere)

1. **Etapa 1 — MVP**
   - Auth angajati (JWT).
   - CRUD clienti.
   - Generare link lunar + email (SMTP).
   - Upload public + dezarhivare + stocare S3/MinIO.
   - Biblioteca: lista clienti cu status, drill-down, descarcare.
   - Notificari email catre angajati la upload.
   - Formular public de re-cerere link.
   - Cerere custom de documente (mecanism de compunere minimal).
2. **Etapa 2**
   - Reminder automat la scadenta, template-uri email din UI, audit log.
3. **Etapa 3**
   - Validare fisiere obligatorii, statistici, roluri.
