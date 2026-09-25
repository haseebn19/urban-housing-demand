FROM mariadb:10.11

# Scripts in this folder run when the database is first created
COPY ./scripts/setup.sql /docker-entrypoint-initdb.d/
