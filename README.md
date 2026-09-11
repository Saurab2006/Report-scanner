# ReportScan

ReportScan is a simple, mobile-first Medical Report Scanner built with Next.js. It helps users upload or scan a medical report, compare readable test values with reference ranges from the report, and understand whether results are HIGH, NORMAL, LOW, or NEEDS REVIEW.

## Features

- Upload JPG, PNG, or PDF medical reports
- Take a report photo using a mobile camera
- Preview the selected report before analysis
- Paste readable report text or key result lines for safer extraction
- Extract test name, value, unit, and reference range when present in the report text
- Classify results as HIGH, NORMAL, LOW, or NEEDS REVIEW
- Show clean mobile result cards instead of large tables
- Support English and नेपाली
- Provide simple explanations and safe general health guidance
- Avoid diagnosis, prescriptions, medication dosages, or medication start/stop advice
- Save analyzed reports and extracted results to PostgreSQL when `DATABASE_URL` is configured

## Important Medical Safety Note

ReportScan is for educational support only. It does not diagnose diseases, prescribe medicine, recommend dosages, or replace a qualified healthcare professional. If a value, unit, or reference range cannot be read clearly, the app marks it as NEEDS REVIEW.

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

## Database

ReportScan uses PostgreSQL with Drizzle ORM. Add a `.env` file with:

```bash
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/reportscan
```

Generate and apply migrations:

```bash
npm run db:generate
npm run db:migrate
```

The database schema is intentionally small:

- `medical_reports` stores the uploaded file name, file type, summaries, and status counts.
- `medical_results` stores each extracted test result, reference range, status, explanation, and guidance.

If `DATABASE_URL` is missing, the app still works and keeps the latest analysis in the browser session.

## Expected Report Text Format

The lightweight analyzer compares values only when it can read both the result and the reference range. Example:

```text
Hemoglobin 12.1 g/dL Reference 13-17 g/dL
WBC 8500 /uL 4000-11000 /uL
Glucose 145 mg/dL 70-140 mg/dL
```

If the app cannot confidently read the result and reference range, it will show NEEDS REVIEW instead of guessing.
