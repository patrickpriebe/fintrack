# CLAUDE.md

Context for future sessions and AI coding agents in this repository. Read before generating code or modifying architecture.

## What this is

**FinTrack** is a modern, high-performance personal finance dashboard. It couples a lean **Laravel 12** REST API with a **React 19** SPA (zero external runtime dependencies beyond React) and a **PostgreSQL** database hosted on Supabase in a dedicated private schema.

Details in [README.md](README.md) and [docs/](docs/).

---

## Core Architectural Invariants

1. **Strict separation of concerns**:
   - `frontend/` is a pure SPA deployed on Vercel. It interacts exclusively via HTTP with `/api/*`.
   - `backend/` is a stateless REST API deployed on Render.
   - `database` is a PostgreSQL instance on Supabase accessed over transactional poolers.
2. **Schema isolation in Supabase**:
   - The API uses a dedicated `fintrack` schema (`create schema if not exists fintrack`), revoked from public anon access. It does not touch Supabase's default `public` schema.
3. **Financial precision is non-negotiable**:
   - Monetary values are stored as `DECIMAL(12,2)` in PostgreSQL and cast to string/decimal format in Eloquent (`decimal:2`). Never use raw IEEE 754 floating point arithmetic for stored balances.
4. **Zero runtime UI dependencies**:
   - The frontend uses vanilla CSS custom properties (design tokens in `styles.css`) and custom SVG/CSS components for charts and calendar pickers. Do not add component libraries (such as MUI, AntD, Tailwind) or charting packages (such as Chart.js, Recharts).

---

## Language Conventions

- **Code, identifiers, routes, table names, columns and JSON fields: English.**
  Examples: `Transaction`, `DashboardController`, `occurred_on`, `amount`, `/api/transactions`, `expenses_by_category`.
- **Code comments, Javadoc/PHPDoc and test descriptions: Portuguese.**
  Follow existing codebase patterns for clarity and localized context.
- **Markdown documentation (`README.md`, `docs/`): English.**
  The repository is a public portfolio piece for an international engineering audience.

---

## Code Conventions

### Backend (PHP 8.3 / Laravel 12)
- **Validation**: Always use dedicated `FormRequest` classes (such as `TransactionRequest`) instead of inline `$request->validate()` in controllers.
- **Type Safety**: Declare strict types or explicit return types on all controller methods, models, and helpers (`JsonResponse`, `Builder`, `array`).
- **Eloquent Models**: Define `$fillable` and explicit `casts()` array methods.
- **Aggregations in Database**: Calculate sums, groupings and monthly balances in the database engine (`SUM(amount)` with composite indexes on `[occurred_on, type]`), never in PHP memory loops.

### Frontend (React 19 / TypeScript/JavaScript / Vite 7)
- **Design Tokens**: All colors, radius, fonts, and transitions come from CSS variables (`--bg`, `--surface`, `--income`, `--expense`, `--balance`).
- **State Management**: Use React hooks (`useState`, `useEffect`, `useCallback`) and native browser APIs.
- **Form Handling**: Native controlled components with immediate validation feedback.

---

## Local Development & Environment

- **OS**: Windows / Linux / macOS. Default Windows shell is PowerShell.
- **Docker Compose**:
  - `docker compose up -d`: Starts PostgreSQL on `localhost:5432` and the full containerized app.
  - `docker compose --profile dev up -d`: Starts PostgreSQL, the backend container, and the Vite frontend dev server with hot reload.
- **Running from Source (without Docker)**:
  - Backend: `cd backend && composer install && cp .env.example .env && php artisan key:generate && php artisan serve`
  - Frontend: `cd frontend && npm install && npm run dev`
- **Testing**:
  - Backend tests: `cd backend && php artisan test`
  - Frontend tests: `cd frontend && npm test`

---

## Deployment & Production Notes

- **Render Backend**: Configured via [render.yaml](render.yaml). Free-tier instances sleep after 15 minutes of inactivity. Scheduled health pings in [.github/workflows/keep-awake.yml](.github/workflows/keep-awake.yml) keep the service responsive during Brazilian business hours (9h–16h BRT).
- **Supabase SSL**: Set `DB_SSLMODE=require` in production (Render) and `DB_SSLMODE=prefer` in local Docker development.
- **Vercel Frontend**: Reverse proxy rules in `vercel.json` rewrite `/api/(.*)` to the Render API URL.

---

## What Comes Next (Roadmap)

When extending the project, keep additions within the planned phases:
1. Multi-user authentication via OIDC / JWT.
2. Recurring monthly transactions and installment simulation.
3. Financial report export (CSV / PDF).
4. Budget and category limit thresholds.
