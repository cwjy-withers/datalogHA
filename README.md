# Datalogning HA — Hörselrehabilitering & Uppföljning

A professional clinical tool for documenting and analysing hearing-aid usage in children and adolescents (ages 0–18). Built for audiologists at hearing rehabilitation clinics, it streamlines session registration, data logging, and result analysis.

---

## Features

### 📋 Session Registration — 3-Step Form
- **Step 1 – Patient Info**: Patient ID (or name), birth year, and age group selection (0–6 / 7–18 years)
- **Step 2 – Situational Assessment**: Age-appropriate situation questionnaires with frequency ratings (Aldrig → Alltid)
- **Step 3 – Clinical Data**:
  - Datalogging usage time (actual vs. estimated) per ear (hours & minutes)
  - Hearing loss grade (HNS) per ear: Normal → Grav (71–80 dB)
  - Hearing loss type per ear: Sensorineural, Ledningshinder, Kombinerad
  - Frequency profile checkboxes: Basnedsättning, Grav diskantnedsättning, Flat loss
  - **Liksidig hörselnedsättning** toggle — automatically mirrors all left-ear values to the right ear
  - Hearing aid type per ear: Baha, Bakom örat, Cros

### 📊 Result Analysis (`/analysis`)
- Live statistics dashboard: total sessions, unique patients, average left/right usage
- Interactive filter panel:
  - Age group (Alla / 0–6 / 7–18)
  - Date range (from / to)
  - HNS grade, HNS type, hearing-aid type
  - Symmetrical hearing loss (Ja / Nej)
- Active filter chips with one-click removal
- Charts: age group distribution, HNS grade distribution, HA type distribution, hearing loss types, situational assessment breakdowns

### 📄 PDF Report
- Generates a per-session PDF report with all clinical data via `@react-pdf/renderer`

### 📥 Excel Export
- Automatically appends each saved session to a local `datalog.xlsx` workbook
- Age-group-specific sheets (`0-6`, `7-18`) with all clinical and situational columns

### 🌗 Dark / Light Mode
- System-aware theme toggle via `next-themes`

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 15](https://nextjs.org/) (App Router) |
| Language | TypeScript 5 |
| UI Components | [shadcn/ui](https://ui.shadcn.com/) + Radix UI |
| Styling | Tailwind CSS v4 |
| Forms | React Hook Form + Zod |
| Database | SQLite via [Prisma 5](https://www.prisma.io/) |
| PDF | @react-pdf/renderer |
| Excel | xlsx (SheetJS) |
| Icons | Lucide React |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or newer
- npm v9 or newer

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/cwjy-withers/datalogHA.git
cd datalogHA

# 2. Install dependencies
npm install

# 3. Set up the database
npx prisma migrate deploy

# 4. Generate the Prisma client
npx prisma generate
```

### Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL="file:./prisma/dev.db"
```

### Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

---

## Project Structure

```
datalog-ha/
├── prisma/
│   ├── schema.prisma        # Database schema (Patient, Session models)
│   └── dev.db               # SQLite database (not tracked in git)
├── src/
│   ├── app/
│   │   ├── page.tsx         # Home — session history table
│   │   ├── new-session/     # Multi-step form for registering a new session
│   │   ├── analysis/        # Result analysis dashboard
│   │   └── api/sessions/    # REST API routes (POST/GET/DELETE)
│   ├── components/
│   │   ├── form/
│   │   │   ├── Step1PatientInfo.tsx
│   │   │   ├── Step2Situation.tsx
│   │   │   └── Step3ClinicalData.tsx
│   │   ├── analysis/
│   │   │   ├── AnalysisPageClient.tsx   # Filters + stat cards
│   │   │   └── AnalysisCharts.tsx       # Chart visualisations
│   │   ├── PDFReport.tsx    # PDF generation component
│   │   └── ui/              # shadcn/ui components
│   └── lib/
│       ├── db.ts            # Prisma client singleton
│       ├── excel.ts         # Excel append logic (SheetJS)
│       └── schemas.ts       # Zod validation schemas
└── datalog.xlsx             # Master Excel log (auto-created on first save)
```

---

## Database Schema

### Patient
| Field | Type | Description |
|---|---|---|
| `id` | UUID | Auto-generated primary key |
| `customId` | String (unique) | The patient name/ID entered by the user |
| `createdAt` | DateTime | Record creation timestamp |

### Session
| Field | Type | Description |
|---|---|---|
| `id` | UUID | Auto-generated primary key |
| `date` | DateTime | Session date |
| `ageGroup` | String | `"0-6"` or `"7-18"` |
| `birthYear` | String? | Patient birth year |
| `usageTimeLeft/Right` | String? | Actual datalogging usage (h:mm) |
| `estimatedUsageTimeLeft/Right` | String? | Patient-estimated usage (h:mm) |
| `hnsGradeLeft/Right` | String? | Hearing loss grade per ear |
| `hnsTypeLeft/Right` | String? | Hearing loss type per ear |
| `symmetricalHearingLoss` | Boolean | Whether both ears share the same HNS profile |
| `basnedsattningLeft/Right` | Boolean | Bass reduction present |
| `diskantnedsattningLeft/Right` | Boolean | Severe treble reduction present |
| `flatLossLeft/Right` | Boolean | Flat loss profile |
| `haTypeLeft/Right` | String? | Hearing aid type per ear |
| `situationalData` | String | JSON-encoded situational assessment ratings |

---

## Usage

1. **Start a new session** — click *Ny Session* on the home page and fill in the 3-step form.
2. **View history** — all saved sessions appear in the *Tidigare Sessioner* table on the home page.
3. **Analyse results** — click *Analys* to open the analysis dashboard. Use the filter panel to narrow down sessions by age group, date range, HNS grade, HA type, and more.
4. **Excel export** — every saved session is automatically appended to `datalog.xlsx` in the project root, with separate sheets per age group.
5. **PDF report** — available per session from the session confirmation screen.

---

## License

This project is private and intended for internal clinical use.
