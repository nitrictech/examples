-- migrations/1_create_table.up.sql
CREATE TABLE IF NOT EXISTS todos (
    id SERIAL PRIMARY KEY,
    text TEXT NOT NULL,
    done BOOLEAN DEFAULT FALSE
);