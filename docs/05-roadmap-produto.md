# Product Roadmap & Scope

## Completed Milestones (Phases 1 & 2)

- [x] **Full-Stack Core Architecture**: Laravel 12 REST API + React 19 SPA.
- [x] **Relational Schema Isolation**: PostgreSQL 16 on Supabase inside private `fintrack` schema.
- [x] **Real-Time Financial Dashboard**: Aggregated income, expense, balance, and expense breakdown by category.
- [x] **Zero-Runtime Dependency UI**: Custom calendar picker, custom CSS/SVG charts, native responsive layouts.
- [x] **Enterprise CI/CD & Security**: GitHub Actions pipeline (PHPUnit, Vitest, secret scanning across full git history, OpenAPI linting, Docker Buildx validation).
- [x] **Operational Keep-Awake Automation**: Scheduled healthchecks maintaining Render free-tier instances active during business hours.
- [x] **Infrastructure as Code**: Multi-stage production Dockerfiles, Docker Compose with development profiles, and Render Blueprint (`render.yaml`).

---

## Planned Enhancements

### Phase 3: Multi-Tenant Identity & Security
- [ ] User authentication with Google OAuth 2.0 / OIDC.
- [ ] Row-Level Security (RLS) or tenant isolation by `user_id` in `fintrack.transactions`.
- [ ] JWT / Bearer token validation on API endpoints.

### Phase 4: Recurring Entries & Installments
- [ ] Scheduled monthly recurring expenses (rent, subscriptions, utilities).
- [ ] Installment purchase distribution (e.g. 12x credit card splits).

### Phase 5: Data Portability & Reports
- [ ] Export transactions to CSV and formatted PDF reports.
- [ ] Bulk import from OFX and standard spreadsheet formats.

### Phase 6: Category Budgets & Spending Limits
- [ ] Monthly budget thresholds per category.
- [ ] Visual alert indicators when spending reaches 80% and 100% of defined budget.

---

## Deliberately Out of Scope

- **Direct Open Banking / Bank Scraping**: Adding third-party bank aggregators requires proprietary credential handling and heavy ongoing maintenance outside the educational focus of this project.
- **Crypto & Stock Trading Portfolios**: FinTrack focuses exclusively on cash flow, budgeting, and personal income/expense tracking.
