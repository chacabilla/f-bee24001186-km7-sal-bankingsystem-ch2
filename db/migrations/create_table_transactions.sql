CREATE TYPE transaction_type_enum AS ENUM ('deposit', 'withdraw');

DROP TYPE transaction_type_enum;

CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    amount DECIMAL(15, 2) NOT NULL,
    type transaction_type_enum NOT NULL,
    id_account INT NOT NULL,
    FOREIGN KEY (id_account) REFERENCES accounts(id)
);

DROP TABLE transactions;

-- membuat indeks pada kolom id_account di tabel transactions
CREATE INDEX idx_transactions_account_id ON transactions (id_account);

DROP INDEX IF EXISTS idx_transactions_account_id;