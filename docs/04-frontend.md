# Frontend Architecture & Design System

## Stack & Principles

| Layer | Choice | Rationale |
|---|---|---|
| **Framework** | React 19 | Declarative UI, fast concurrent rendering |
| **Bundler** | Vite 7 | Lightning-fast HMR and optimized production bundling |
| **Styling** | Vanilla CSS Custom Properties | Zero runtime overhead, 100% style control |
| **Icons & Charts** | Pure CSS & Native SVG | No heavy external chart/icon dependencies |
| **Testing** | Vitest 3 | Fast unit testing with Vite environment |

The frontend intentionally ships with **zero runtime dependencies beyond React**. This guarantees sub-second page loads, a microscopic bundle footprint, and minimal maintenance surface.

---

## Design System & Tokens

All typography, layout spacing, elevation, and palette colors derive from CSS variables in [`frontend/src/styles.css`](../frontend/src/styles.css):

```css
:root {
  --bg: #090d16;
  --surface: #111827;
  --surface-subtle: #1a2234;
  --border: #26334d;
  --text-primary: #f3f4f6;
  --text-secondary: #94a3b8;
  --income: #10b981;
  --expense: #ef4444;
  --balance: #3b82f6;
  --radius: 12px;
  --transition: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
```

---

## Component Structure

```
frontend/src/
├── components/
│   ├── AnalysisSection.jsx   # Visual breakdown (comparative ratio & category distribution)
│   ├── CalendarPicker.jsx    # Custom date & month selection popup
│   ├── SummaryCard.jsx       # Financial KPI cards (Income, Expense, Balance)
│   └── TransactionForm.jsx   # Fast transaction entry form with category pills
├── services/
│   └── api.js                # Resilient Fetch API client with validation parser
├── styles.css                # Global design system & token definitions
├── utils.js                  # Currency & date formatting helpers
└── App.jsx                   # Application shell & unified data orchestration
```

---

## Key Interaction Features

1. **Unified Period Synchronization**:
   When the month changes in `CalendarPicker`, `App.jsx` executes a concurrent `Promise.all()` fetching both the monthly dashboard metrics (`GET /api/dashboard`) and the transaction history (`GET /api/transactions`).

2. **Custom CSS/SVG Charts**:
   - The comparison between total income and expenses is rendered as a dynamic stacked ratio bar in CSS.
   - Expenses by category are rendered with proportional progress tracks, avoiding the megabyte payload of canvas/WebGL charting libraries.

3. **Graceful Error Handling**:
   The API client unwraps Laravel validation error dictionaries (`errors: { amount: [...] }`) and displays clear, actionable alerts to the user without breaking state.
