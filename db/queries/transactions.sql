INSERT INTO transactions (amount, type, id_account)
SELECT 
    round((random() * 5000)::numeric, 2) AS amount, 
    CASE WHEN mod(id, 2) = 0 THEN 'deposit' ELSE 'withdraw' END::transaction_type_enum AS type, 
    id
FROM generate_series(1, 10) AS id;

SELECT * FROM transactions;