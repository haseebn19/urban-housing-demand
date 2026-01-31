# API Reference

Base URL: `http://localhost:8080/api/housing`

## Endpoints

### Housing Data

#### GET `/starts-completions/total`

Returns housing starts and completions by city.

**Response:**
```json
[
  {
    "city": "Toronto",
    "year": 2024,
    "month": 6,
    "totalStarts": 4743,
    "totalCompletions": 3810
  }
]
```

---

#### GET `/starts-completions/ratio`

Returns completion-to-start ratios.

**Response:**
```json
[
  {
    "city": "Toronto",
    "year": 2024,
    "month": 6,
    "ratio": 0.8034
  }
]
```

---

### Labour Market Data

#### GET `/labour-market/occupation`

Returns occupation distribution by city.

**Response:**
```json
[
  {
    "city": "Toronto",
    "occupation": "Professional occupations in finance"
  }
]
```

---

#### GET `/labour-market/family-type`

Returns family type distribution by city.

**Response:**
```json
[
  {
    "city": "Toronto",
    "familyType": "Dual-earner couple, no children or none under 25"
  }
]
```

---

#### GET `/labour-market/immigration-data`

Returns immigration status by city.

**Response:**
```json
[
  {
    "city": "Toronto",
    "year": 2023,
    "month": 6,
    "immigrantStatus": "Immigrant"
  }
]
```

---

## Error Responses

```json
{
  "timestamp": "2024-01-30T12:00:00",
  "status": 500,
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

## Interactive Docs

Swagger UI: http://localhost:8080/api/docs.html
