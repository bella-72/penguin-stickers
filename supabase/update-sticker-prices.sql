-- Update products created with the legacy 7 EGP import default.
-- Leave products that already have a different configured price untouched.
BEGIN;

UPDATE public.products
SET price = 10,
    original_price = 15
WHERE price = 7
  AND original_price IS NULL;

COMMIT;

SELECT price, original_price, COUNT(*) AS product_count
FROM public.products
GROUP BY price, original_price
ORDER BY price, original_price;
