# System Architecture

## Overview

Urban Housing Demand is a full-stack web application with four main components:

```
┌─────────┐     ┌─────────┐     ┌──────────┐
│ Browser │────▶│Frontend │────▶│ Backend  │
└─────────┘     └─────────┘     └────┬─────┘
                                     │
                                     ▼
┌─────────┐     ┌─────────┐     ┌──────────┐
│External │────▶│Ingestor │────▶│ Database │
│  API    │     └─────────┘     └──────────┘
└─────────┘
```

## Components

### Frontend (React + TypeScript)

- **Purpose:** Interactive data visualization
- **Key Libraries:** Chart.js, React 18
- **Features:** Dark/light theme, responsive charts

### Backend (Spring Boot)

- **Purpose:** REST API for housing and labour data
- **Key Features:** DTOs, global exception handling, Swagger docs
- **Port:** 8080

### Database (MariaDB)

- **Purpose:** Data persistence
- **Tables:** housing_starts_completions, labour_market, apartment_starts/completions
- **Port:** 3306

### Ingestor (Python)

- **Purpose:** Fetch data from external APIs and populate database
- **Features:** Retry logic, graceful API fallback, SQL injection protection

## Sequence Diagrams

### User Request Flow

```
User → Frontend → Backend → Database
                     ↓
              Service Layer
                     ↓
                   DAO
                     ↓
               SQL Query
```

### Data Ingestion Flow

```
Scheduler → Ingestor → External API
                ↓
           Database
```

## Docker Services

| Service | Image | Ports |
|---------|-------|-------|
| frontend | Node 20 | 3000 |
| backend | Eclipse Temurin 21 | 8080 |
| database | MariaDB 10.11 | 3306 |
| ingestor | Python 3.12 | - |
