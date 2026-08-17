# API Contracts & Endpoints

Complete OpenAPI 3.0 specification available at [`contracts/openapi/fintrack-api.yaml`](../contracts/openapi/fintrack-api.yaml).

---

## Base URLs

- **Local Development**: `http://localhost:8000/api`
- **Production (Render)**: `https://fintrack-api-08b9.onrender.com/api`

---

## Endpoints

### 1. Health Check
`GET /health`

Used by container orchestrators, Render readiness checks, and CI keep-awake schedulers.

**Response `200 OK`**:
```json
{
  "status": "ok",
  "service": "FinTrack"
}
```

---

### 2. Monthly Dashboard Aggregations
`GET /dashboard?month={YYYY-MM}`

Returns aggregated financial summary and categorized breakdown for the selected period.

| Parameter | Type | Required | Description | Example |
|---|---|---|---|---|
| `month` | `string` | **Yes** | Year and month in `YYYY-MM` format | `2026-08` |

**Response `200 OK`**:
```json
{
  "data": {
    "period": "2026-08",
    "income": 5000.00,
    "expense": 2250.50,
    "balance": 2749.50,
    "expenses_by_category": [
      { "category": "Moradia", "total": 1800.00 },
      { "category": "Alimentação", "total": 450.50 }
    ]
  }
}
```

**Error `422 Unprocessable Entity`**:
```json
{
  "message": "The month field is required.",
  "errors": {
    "month": ["The month field must match the format Y-m."]
  }
}
```

---

### 3. List Transactions
`GET /transactions?month={YYYY-MM}`

Returns transactions ordered by `occurred_on DESC, id DESC`.

| Parameter | Type | Required | Description | Example |
|---|---|---|---|---|
| `month` | `string` | No | Optional filter for a specific month | `2026-08` |

**Response `200 OK`**:
```json
{
  "data": [
    {
      "id": 1,
      "type": "expense",
      "category": "Alimentação",
      "description": "Mercado da semana",
      "amount": "189.90",
      "occurred_on": "2026-08-03",
      "created_at": "2026-08-03T18:00:00.000000Z",
      "updated_at": "2026-08-03T18:00:00.000000Z"
    }
  ]
}
```

---

### 4. Create Transaction
`POST /transactions`

**Request Body**:
```json
{
  "type": "expense",
  "category": "Moradia",
  "description": "Condomínio",
  "amount": 450.00,
  "occurred_on": "2026-08-10"
}
```

**Validation Rules**:
- `type`: `required`, `in:income,expense`
- `category`: `required`, `string`, `max:50`
- `description`: `nullable`, `string`, `max:255`
- `amount`: `required`, `numeric`, `gt:0`, `decimal:0,2`
- `occurred_on`: `required`, `date_format:Y-m-d`

**Response `201 Created`**:
```json
{
  "data": {
    "id": 2,
    "type": "expense",
    "category": "Moradia",
    "description": "Condomínio",
    "amount": "450.00",
    "occurred_on": "2026-08-10",
    "created_at": "2026-08-10T12:00:00.000000Z",
    "updated_at": "2026-08-10T12:00:00.000000Z"
  }
}
```

---

### 5. Delete Transaction
`DELETE /transactions/{id}`

Permanently removes a transaction record.

**Response `204 No Content`**
