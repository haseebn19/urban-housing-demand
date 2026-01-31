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

Copy `.env.example` to `.env` to customize:

```bash
cp .env.example .env
```

| Variable | Default | Description |
|----------|---------|-------------|
| `DB_DATABASE` | template_db | Database name |
| `DB_USER` | root | Database user |
| `DB_PASSWORD` | pwd | Database password |
| `API_KEY` | _(empty)_ | External API key (optional) |
