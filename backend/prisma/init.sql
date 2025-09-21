-- Initialize database for Sport Achievements & Friends app
-- This file is executed when the PostgreSQL container starts for the first time

-- Create database if it doesn't exist
SELECT 'CREATE DATABASE sport_achievements_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'sport_achievements_db')\gexec

-- Connect to the database
\c sport_achievements_db;

-- Create extensions if they don't exist
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Set timezone
SET timezone = 'UTC';

-- Create a simple health check function
CREATE OR REPLACE FUNCTION health_check()
RETURNS TEXT AS $$
BEGIN
    RETURN 'Database is healthy and ready!';
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions
GRANT ALL PRIVILEGES ON DATABASE sport_achievements_db TO postgres;

-- Log successful initialization
DO $$
BEGIN
    RAISE NOTICE 'Sport Achievements database initialized successfully!';
END $$;
