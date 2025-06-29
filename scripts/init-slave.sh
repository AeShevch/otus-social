#!/bin/bash
set -e

echo "=== PostgreSQL Slave Initialization ==="

if [ ! -f /var/lib/postgresql/data/PG_VERSION ]; then
    echo "Starting slave initialization..."
    
    echo "Waiting for master to be ready..."
    until pg_isready -h postgres-master -p 5432; do 
        echo "Master not ready, waiting..."
        sleep 2
    done
    echo "Master is ready!"
    
    echo "Clearing data directory..."
    rm -rf /var/lib/postgresql/data/*
    
    echo "Creating base backup from master..."
    pg_basebackup -h postgres-master -D /var/lib/postgresql/data -U replicator -v -P --wal-method=stream
    
    echo "Configuring standby mode..."
    touch /var/lib/postgresql/data/standby.signal
    
    echo "primary_conninfo = 'host=postgres-master port=5432 user=replicator password=replicator_password'" >> /var/lib/postgresql/data/postgresql.conf
    
    echo "Setting correct permissions..."
    chown -R postgres:postgres /var/lib/postgresql/data
    chmod 700 /var/lib/postgresql/data
    
    echo "Slave initialization completed!"
else
    echo "Slave already initialized, skipping..."
fi

echo "Starting PostgreSQL server..."
exec gosu postgres postgres 