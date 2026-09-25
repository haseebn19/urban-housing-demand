# MySQL/MariaDB database for Urban Housing Demand
FROM mariadb:10.11

# Copy initialization scripts
# Scripts in docker-entrypoint-initdb.d run automatically on first start
COPY ./scripts/setup.sql /docker-entrypoint-initdb.d/

# Set proper permissions
RUN chmod 644 /docker-entrypoint-initdb.d/setup.sql
