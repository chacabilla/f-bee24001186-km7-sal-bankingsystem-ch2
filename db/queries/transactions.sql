INSERT INTO transactions (amount, type, id_account)
SELECT 
    round((random() * 5000)::numeric, 2) AS amount, 
    CASE WHEN mod(id, 2) = 0 THEN 'deposit' ELSE 'withdraw' END::transaction_type_enum AS type, 
    id
FROM generate_series(1, 10) AS id;

SELECT * FROM transactions;

SELECT * FROM transactions WHERE type = 'deposit';

SELECT * FROM transactions WHERE type = 'withdraw';

UPDATE transactions
SET amount = 2500
WHERE id = 3;

DELETE FROM transactions WHERE id = 8;