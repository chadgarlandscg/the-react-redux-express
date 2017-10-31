\c postgres_db;

DROP TABLE IF EXISTS nosql_table;
DROP TABLE IF EXISTS sql_table;
DROP TABLE IF EXISTS app_user;

CREATE TABLE app_user (
    id SERIAL PRIMARY KEY,
    email VARCHAR(50)
);

CREATE TABLE nosql_table (
    id SERIAL PRIMARY KEY,
    json_data JSONB
);

CREATE TABLE sql_table (
    id SERIAL PRIMARY KEY,
    app_user_id INT REFERENCES app_user(id),
    table_data REAL
);