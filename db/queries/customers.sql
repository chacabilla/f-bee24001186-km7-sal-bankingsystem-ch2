INSERT INTO customers (name_cust, address_cust)
SELECT 'Customer ' || generate_series(1, 10), 'Address ' || generate_series(1, 10);

SELECT * FROM customers;

UPDATE customers
SET address_cust = 'Updated Address'
WHERE id = 1;

DELETE FROM customers WHERE id = 10;

-- menapilkan nama customer, jenis akun dan jumlah transaksi dengan jenis transaksi
SELECT c.name_cust, a.account_type, t.amount, t.type
FROM customers c
INNER JOIN accounts a ON c.id = a.id_customer
INNER JOIN transactions t ON a.id = t.id_account
WHERE t.type = 'deposit';