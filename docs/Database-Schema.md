# Database Schema

## ER Diagram

```
┌─────────────────────────────┐
│ housing_starts_completions  │
├─────────────────────────────┤
│ id (PK)                     │
│ year                        │
│ month                       │
│ city                        │
│ singles_starts              │
│ semis_starts                │
│ row_starts                  │
│ apt_other_starts            │
│ total_starts                │
│ singles_complete            │
│ semis_complete              │
│ row_complete                │
│ apt_other_complete          │
│ total_complete              │
│ last_updated                │
└─────────────────────────────┘

┌─────────────────────────────┐
│ labour_market               │
├─────────────────────────────┤
│ rec_num (PK)                │
│ survyear                    │
│ survmnth                    │
│ cma                         │
│ NOC_43                      │
│ EFAMTYPE                    │
│ immig                       │
│ HRLYEARN                    │
│ last_updated                │
└─────────────────────────────┘
```

## Tables

### housing_starts_completions

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT | Primary Key |
| `year` | YEAR | Year of data |
| `month` | TINYINT | Month (1-12) |
| `city` | VARCHAR(100) | Toronto or Hamilton |
| `total_starts` | INT | Total housing starts |
| `total_complete` | INT | Total completions |
| `last_updated` | TIMESTAMP | Last update |

### labour_market

| Column | Type | Description |
|--------|------|-------------|
| `rec_num` | INT | Primary Key |
| `survyear` | INT | Survey year |
| `survmnth` | INT | Survey month |
| `cma` | INT | City code (535=Toronto, 537=Hamilton) |
| `NOC_43` | INT | Occupation code |
| `EFAMTYPE` | INT | Family type code |
| `immig` | INT | Immigration status |

## Code Mappings

### CMA (City) Codes

| Code | City |
|------|------|
| 535 | Toronto |
| 537 | Hamilton |

### Immigration Status

| Code | Status |
|------|--------|
| 1, 2 | Immigrant |
| 3 | Non-immigrant |

### Occupation Codes (NOC_43)

| Code | Occupation |
|------|------------|
| 1 | Legislative and senior management |
| 5 | Professional occupations in finance |
| 12 | Professional occupations in engineering |
| 14 | Health professionals |
| 20 | Education professionals |

### Family Type Codes (EFAMTYPE)

| Code | Type |
|------|------|
| 1 | Person not in an economic family |
| 2 | Dual-earner couple, no children |
| 3 | Dual-earner couple, children 0-17 |
| 14 | Lone-parent, employed |
