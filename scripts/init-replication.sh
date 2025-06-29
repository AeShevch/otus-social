#!/bin/bash
set -e

echo "Creating replication user..."

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    DO \$\$
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'replicator') THEN
            CREATE USER replicator WITH REPLICATION PASSWORD 'replicator_password';
            GRANT CONNECT ON DATABASE $POSTGRES_DB TO replicator;
        END IF;
    END
    \$\$;
EOSQL

echo "Replication user created successfully!"