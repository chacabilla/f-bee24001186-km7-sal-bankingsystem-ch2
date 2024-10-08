CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    name_cust VARCHAR(100) NOT NULL,
    address_cust VARCHAR(200) NOT NULL
);

DROP TABLE customers;