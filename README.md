# Urban Housing Demand

[![CI](https://github.com/haseebn19/urban-housing-demand/actions/workflows/ci.yml/badge.svg)](https://github.com/haseebn19/urban-housing-demand/actions/workflows/ci.yml)

A full-stack web application for visualizing housing and labour market data for Toronto and Hamilton, Ontario.

## Features

- **Housing Data Visualization**: Track housing starts and completions over time
- **Completion Ratios**: Compare completion rates between Toronto and Hamilton
- **Labour Market Analysis**: View occupation and family type distributions
- **Immigration Trends**: Monitor immigration patterns in both cities
- **Dark/Light Theme**: Toggle between themes for comfortable viewing

## Quick Start

**Prerequisites:** [Docker Desktop](https://www.docker.com/products/docker-desktop/)

```bash
# Clone and start
git clone https://github.com/haseebn19/urban-housing-demand.git
cd urban-housing-demand
docker compose up -d

# Open http://localhost:3000
```

## Commands

```bash
# Start application
docker compose up -d

# Run all tests
docker compose -f compose.test.yaml up --build

# Stop application
docker compose down

# View logs
docker compose logs -f
```

## Documentation

See the [Wiki](../../wiki) for detailed documentation:

- [Getting Started](../../wiki/Getting-Started) - Installation and setup
- [Architecture](../../wiki/Architecture) - System design overview
- [API Reference](../../wiki/API-Reference) - REST endpoints
- [Database Schema](../../wiki/Database-Schema) - Tables and mappings
- [Development Guide](../../wiki/Development-Guide) - Contributing

> **Note:** Documentation source files are in the `docs/` folder.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, TypeScript, Chart.js |
| Backend | Spring Boot, Java 17 |
| Database | MariaDB/MySQL |
| Ingestor | Python 3.11 |
| DevOps | Docker, GitHub Actions |

## Project Structure

```
urban-housing-demand/
├── frontend/          # React application
├── backend/           # Spring Boot API
├── database/          # SQL schema & seed data
├── ingestor/          # Python data loader
├── docs/              # Documentation
└── compose.yaml       # Docker orchestration
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

Developed for CIS*4900 at the University of Guelph.
