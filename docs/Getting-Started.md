# Getting Started

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Windows, macOS, or Linux)
- Git

## Installation

```bash
# Clone the repository
git clone https://github.com/haseebn19/urban-housing-demand.git
cd urban-housing-demand

# Start all services
docker compose up -d
```

## Access the Application

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8080 |
| API Docs (Swagger) | http://localhost:8080/api/docs.html |

## Basic Commands

```bash
# Start application
docker compose up -d

# Stop application
docker compose down

# View logs
docker compose logs -f

# Run all tests
docker compose -f compose.test.yaml up --build

# Rebuild after changes
docker compose up -d --build
```

## Environment Variables

Copy `.env.example` to `.env` and set at least `DB_PASSWORD`:

```bash
cp .env.example .env
# Edit .env and set DB_PASSWORD=your_secure_password
```

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DB_PASSWORD` | **Yes** | _(none)_ | Database password |
| `DB_DATABASE` | No | urban_housing_demand | Database name |
| `DB_USER` | No | root | Database user |
| `API_KEY` | No | _(empty)_ | External API key (optional) |
