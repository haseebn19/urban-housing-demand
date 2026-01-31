# Development Guide

## Project Structure

```
urban-housing-demand/
├── frontend/              # React + TypeScript
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── services/      # API client
│   │   └── tests/         # Jest tests
│   └── Dockerfile
├── backend/               # Spring Boot
│   ├── src/main/java/
│   │   └── .../housing/
│   │       ├── controllers/
│   │       ├── dto/
│   │       ├── dao/
│   │       └── models/
│   └── Dockerfile
├── database/
│   └── scripts/setup.sql  # Schema + seed data
├── ingestor/              # Python
│   ├── database.py
│   ├── ingestor.py
│   └── tests/
└── compose.yaml
```

## Running Tests

All tests run in Docker containers (no local installation needed):

```bash
docker compose -f compose.test.yaml up --build
```

This runs:
- Frontend: Jest + React Testing Library
- Backend: JUnit 5 + Mockito
- Ingestor: pytest

## Adding New Features

### Frontend Component

1. Create component in `frontend/src/components/`
2. Add API function in `frontend/src/services/housingService.ts`
3. Add tests in `frontend/src/tests/`
4. Import in `App.tsx`

### Backend Endpoint

1. Add DTO in `backend/.../housing/dto/`
2. Add method to `HousingService` interface
3. Implement in `HousingServiceImpl`
4. Add endpoint in `HousingController`
5. Add tests

### Database Changes

1. Update `database/scripts/setup.sql`
2. Update DAO queries if needed
3. Rebuild: `docker compose up -d --build`

## Debugging

### View Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend
```

### Access Container Shell

```bash
docker compose exec backend bash
docker compose exec frontend sh
```

### Database Access

```bash
docker compose exec database mysql -u root -ppwd template_db
```

## CI/CD

GitHub Actions runs on every push:

1. **Lint** - ESLint, Checkstyle, Ruff
2. **Test** - Jest, JUnit, pytest
3. **Build** - Docker images

See `.github/workflows/ci.yml`
