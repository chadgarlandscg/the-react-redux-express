\c postgres_db;

DROP TABLE IF EXISTS nosql_table;
DROP TABLE IF EXISTS sql_table;

CREATE TABLE nosql_table (
    id SERIAL PRIMARY KEY,
    json_data JSONB
);

CREATE TABLE sql_table (
    id SERIAL PRIMARY KEY,
    table_data VARCHAR(30)
);
