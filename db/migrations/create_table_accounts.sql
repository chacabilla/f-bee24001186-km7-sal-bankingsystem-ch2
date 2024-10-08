CREATE TYPE account_type_enum AS ENUM ('deposito', 'saving');

DROP TYPE account_type_enum;

CREATE TABLE IF NOT EXISTS accounts (
    id SERIAL PRIMARY KEY,
    account_type account_type_enum NOT NULL,
    saldo DECIMAL(15, 2) NOT NULL,
    id_customer INT NOT NULL,
    FOREIGN KEY (id_customer) REFERENCES customers(id)
);

DROP TABLE accounts;

-- membuat indeks pada kolom id_customer di tabel accounts
CREATE INDEX idx_accounts_customer_id ON accounts (id_customer);

DROP INDEX IF EXISTS idx_accounts_customer_id;