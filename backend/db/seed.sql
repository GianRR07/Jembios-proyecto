-- PRODUCTS
INSERT INTO products (name, category, price, stock, weight, active) VALUES
('Camiseta básica', 'ropa', 39.90, 50, 0.2, 1),
('Polo deportivo', 'ropa', 59.90, 30, 0.25, 1),
('Zapatillas Urban', 'calzado', 199.00, 15, 0.9, 1),
('Gorra clásica', 'accesorios', 29.90, 100, 0.15, 1);

-- SHIPPING RATES
INSERT INTO shipping_rates (district, base_price, price_per_kg) VALUES
('Lima Centro', 8.00, 2.50),
('Lima Norte', 10.00, 3.00),
('Lima Sur', 10.00, 3.00),
('Lima Este', 10.00, 3.00);

-- COUPONS
INSERT INTO coupons (code, discount_type, value, expires_at, min_amount) VALUES
('HOLA10', 'percent', 10, NULL, 50),
('ENVIOFREE', 'fixed', 8, NULL, 80);


INSERT INTO employees (name, role, active) VALUES
('Ana Almacén', 'picker', 1),
('Bruno Packing', 'packer', 1),
('Carla QA', 'qa', 1);
