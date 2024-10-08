INSERT INTO accounts (account_type, saldo, id_customer)
SELECT 
    CASE WHEN mod(id, 2) = 0 THEN 'deposito' ELSE 'saving' END::account_type_enum AS account_type, 
    round((random() * 10000)::numeric, 2) AS saldo, 
    id
FROM generate_series(1, 10) AS id;

SELECT * FROM accounts;

SELECT * FROM accounts WHERE saldo > 5000;

UPDATE accounts
SET saldo = saldo + 1000
WHERE id = 2;

DELETE FROM accounts WHERE id = 9;