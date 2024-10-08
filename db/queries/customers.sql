INSERT INTO customers (name_cust, address_cust)
SELECT 'Customer ' || generate_series(1, 10), 'Address ' || generate_series(1, 10);

SELECT * FROM customers;