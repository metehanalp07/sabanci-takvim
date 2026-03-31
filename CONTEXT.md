What it is

Ders Takvimi is a Turkish, student-oriented schedule app (the folder name “sabanci-takvim” fits a university timetable use case). It is a single-page app: `student-calendar.html` holds layout, styles, and client logic. Firebase client settings live in `firebase-config.js` (`window.FIREBASE_CONFIG`).

Authentication & data

- **Google sign-in** via Firebase Auth. The app does not show the main UI until the user is signed in.
- **Firestore** stores each user’s data under `users/{uid}`: `events`, `layers`, `customTypes`, `notifications`, `settings`, plus `updatedAt`. Writes are debounced after edits.
- **Security:** Firestore rules should restrict `users/{userId}` to `request.auth.uid == userId` (see `firestore.rules`).
- **Theme** (`drs-tkv-theme`) stays in **localStorage** (device-local, not synced).
- **Legacy / first run:** If a user has no Firestore document yet but has old data in localStorage (`drs-tkv-v7`), that snapshot is migrated on first load and then cloud is the source of truth.

What it does

Calendars

- **Desktop (wider than 768px):** **Week** (Mon–Sun, ~07:00–22:00) and **Month** views; floating **+** FAB (bottom-right) to add events. Sidebar always visible with theme, layers, mini month, import/export, sign-out.
- **Mobile (≤ 768px):**
  - **Default view:** **Day** — list of that day’s events (sorted by time), each row as a pill with a **left border color by event type** (e.g. lesson blue, office green, exam red; custom types use their own color).
  - **Week strip (always under the top bar):** Seven **pill** cells (Pt … Pz) for the current ISO week, day number under the label, **blue dot** if that day has events, **selected day** filled blue with white text. Tapping a day jumps to that date and switches to **Day** view if needed.
  - **Week view:** One **shared scroll** for the whole grid: **single** `overflow` container (not per-day columns). **Time column** stays **sticky on the left** while scrolling horizontally; **header row** is sticky at the top when scrolling vertically; all day columns and the time axis move together on the **same** vertical scroll. Day columns are still ~⅓ viewport wide so you swipe horizontally across the week.
  - **Month:** Same month grid as desktop with **slightly taller cells** on small screens.
  - **Bottom bar:** **Gün · Hafta · Ay · Bildirim · Profil** — **round + FAB** centered above the bar. “Bildirim” opens a full-screen notifications view; “Profil” opens the sidebar. The floating desktop FAB is hidden on mobile.
  - **Sidebar** is off-canvas until opened (**hamburger** or **Profil**); dimmed **overlay** closes it.

- **Toolbar:** Prev/next and **Bugün** behave per view (e.g. day steps by one day). **Yükle / Yedekle** (JSON) lives in the sidebar on mobile and in the top bar on desktop (import requires sign-in).

Layers (“Katmanlar”)

- Default layers: Ders Programı, Office Hours, Sınavlar, each tied to a type and color.
- Add layers, toggle visibility, or delete a layer (and its events).

Events

- Title, type (fixed: Ders, Office Hour, Sınav/Ödev; or custom types), optional course/code (e.g. EE202), notes, color, start/end time.
- Recurring types use weekday selection (Pt–Pz); non-recurring (e.g. exam) use a single date.
- Clicking a slot or add opens an add/edit modal; clicking an event opens a detail popover with **Düzenle**. On mobile, modals are **full-screen** (`inset: 0`) with a large **×** close control in the header.

Time UI

- Dual SVG “clock” pickers for start/end, plus typed HH:MM fields, constrained to the visible day range in the week grid.

Data & backup

- Primary persistence: **Firestore** for signed-in users.
- Export downloads `takvim-yedek.json`; import merges into the current state and saves to Firestore.

Notifications (Gmail integration)

- Notifications open from a **top-right bell** as a popup (desktop) and a **full-screen drawer** (mobile). It has **three tabs**: Sınavlar / Ödevler / Duyurular, each with an unread badge.
- Gmail scanning uses Google OAuth scope `gmail.readonly` and pulls the last 30 days with a sender filter (`from:sabanciuniv.edu OR from:sucourse.sabanciuniv.edu`) and recipient filter using the user’s saved Sabancı email (`to:` / `cc:`).
- Parsed items are stored in Firestore `users/{uid}.notifications` and de-duplicated by \(kind + course + date\).
- **Dismissed** items are persisted to Firestore under `notifications/{uid}/dismissed` (by dedupe key) so they won’t reappear after refresh. Bulk delete performs dismiss for the whole group (double confirmation).
- “Duyuru” (announcements) are stored separately (`kind: announcement`) and shown under a **Duyurular** section; they can’t be added to the calendar.

Profile / settings

- Clicking the top-right avatar opens a **profile/settings dropdown**.
- Settings stored in Firestore `settings`: `sabanciEmail`, `scanPeriod` (manual/daily/weekly), `soundEnabled`, `lastMailScanAt`.
- If `sabanciEmail` is missing, the notifications area shows a warning: “Sabancı mailinizi profil ayarlarından ekleyin, maillerinizi tarayalım”.

UX / polish

- Turkish copy, DM Sans / DM Mono, light/dark/system theme in the sidebar.
- Mini-calendar in the sidebar stays synced with the main view.
- **Mobile:** Touch-friendly targets (~44px), swipe to change day in day view, **unified week scroll** as above; resizing to a wide viewport switches **day → week** so the desktop layout stays predictable.

In short: a student timetable with layers, recurring classes vs one-off exams, Google-backed sync per user, JSON backup/import, and a responsive layout: **desktop** = classic sidebar + week/month + corner FAB; **phone** = day-first + week strip + bottom nav with center FAB and profile, drawer sidebar, and a single-scroll mobile week grid with a sticky time column.
