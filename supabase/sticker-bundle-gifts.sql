-- Deploy this migration before enabling sticker bundle gift checkout.
ALTER TABLE public.order_items
  ADD COLUMN IF NOT EXISTS is_free_gift BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS is_custom BOOLEAN NOT NULL DEFAULT FALSE;

DROP POLICY IF EXISTS "Users can create orders" ON public.orders;
DROP POLICY IF EXISTS "Users can create order items" ON public.order_items;

REVOKE INSERT ON public.orders FROM anon, authenticated;
REVOKE INSERT ON public.order_items FROM anon, authenticated;

CREATE TABLE IF NOT EXISTS public.checkout_custom_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  image_data TEXT NOT NULL,
  claimed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.checkout_custom_items
  ADD COLUMN IF NOT EXISTS claimed_at TIMESTAMPTZ;
ALTER TABLE public.checkout_custom_items ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.checkout_custom_items FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.create_checkout_custom_item(p_name TEXT, p_image TEXT)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_id UUID;
BEGIN
  IF NULLIF(BTRIM(p_name), '') IS NULL OR length(p_name) > 200
     OR NULLIF(p_image, '') IS NULL OR length(p_image) > 15000000 THEN
    RAISE EXCEPTION 'Invalid custom sticker details.';
  END IF;

  DELETE FROM public.checkout_custom_items
   WHERE claimed_at IS NULL
     AND created_at < NOW() - INTERVAL '30 days';

  INSERT INTO public.checkout_custom_items (user_id, name, image_data)
  VALUES (auth.uid(), BTRIM(p_name), p_image)
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

REVOKE ALL ON FUNCTION public.create_checkout_custom_item(TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_checkout_custom_item(TEXT, TEXT) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.create_order_with_items(p_order JSONB)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_item JSONB;
  v_user_id UUID := auth.uid();
  v_payload_user_id UUID;
  v_order public.orders%ROWTYPE;
  v_product public.products%ROWTYPE;
  v_custom_item public.checkout_custom_items%ROWTYPE;
  v_product_id UUID;
  v_custom_item_id UUID;
  v_custom_item_ids UUID[] := ARRAY[]::UUID[];
  v_claimed_custom_count INTEGER := 0;
  v_quantity INTEGER;
  v_is_free_gift BOOLEAN;
  v_is_custom BOOLEAN;
  v_paid_units BIGINT := 0;
  v_free_units BIGINT := 0;
  v_gift_allowance INTEGER := 0;
  v_subtotal NUMERIC(10, 2) := 0;
  v_shipping NUMERIC(10, 2) := 0;
  v_discount NUMERIC(10, 2) := 0;
  v_discount_percent NUMERIC(5, 2) := 0;
  v_total NUMERIC(10, 2) := 0;
  v_coupon_code TEXT;
  v_order_lines JSONB := '[]'::JSONB;
  v_order_item_name TEXT;
  v_order_item_image TEXT;
  v_order_item_price NUMERIC(10, 2);
  v_finish_type TEXT;
BEGIN
  IF jsonb_typeof(p_order) IS DISTINCT FROM 'object'
     OR jsonb_typeof(p_order->'items') IS DISTINCT FROM 'array' THEN
    RAISE EXCEPTION 'Invalid order payload.';
  END IF;

  IF jsonb_array_length(p_order->'items') = 0 OR jsonb_array_length(p_order->'items') > 200 THEN
    RAISE EXCEPTION 'The order must contain between 1 and 200 item lines.';
  END IF;

  IF NULLIF(BTRIM(p_order->>'full_name'), '') IS NULL
     OR NULLIF(BTRIM(p_order->>'phone'), '') IS NULL
     OR NULLIF(BTRIM(p_order->>'address'), '') IS NULL
     OR NULLIF(BTRIM(p_order->>'governorate'), '') IS NULL THEN
    RAISE EXCEPTION 'Complete the required shipping information.';
  END IF;

  IF COALESCE(p_order->>'payment_method', '') NOT IN ('cod', 'vodafone', 'instapay') THEN
    RAISE EXCEPTION 'Invalid payment method.';
  END IF;

  IF p_order->>'user_id' IS NOT NULL THEN
    v_payload_user_id := (p_order->>'user_id')::UUID;
    IF v_payload_user_id IS DISTINCT FROM v_user_id THEN
      RAISE EXCEPTION 'Order user does not match the signed-in user.';
    END IF;
  END IF;

  FOR v_item IN SELECT value FROM jsonb_array_elements(p_order->'items')
  LOOP
    IF jsonb_typeof(v_item) IS DISTINCT FROM 'object'
       OR COALESCE(v_item->>'quantity', '') !~ '^[0-9]+$' THEN
      RAISE EXCEPTION 'Invalid item quantity.';
    END IF;

    v_quantity := (v_item->>'quantity')::INTEGER;
    IF v_quantity < 1 OR v_quantity > 10000 THEN
      RAISE EXCEPTION 'Item quantity is outside the allowed range.';
    END IF;

    v_is_free_gift := COALESCE((v_item->>'is_free_gift')::BOOLEAN, FALSE);
    v_is_custom := COALESCE((v_item->>'is_custom')::BOOLEAN, FALSE);
    v_finish_type := COALESCE(NULLIF(v_item->>'finish_type', ''), 'matte');

    IF v_is_free_gift THEN
      IF v_is_custom
         OR COALESCE(v_item->>'product_id', '') !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$' THEN
        RAISE EXCEPTION 'Free gifts must be existing regular stickers.';
      END IF;

      v_product_id := (v_item->>'product_id')::UUID;
      SELECT * INTO v_product FROM public.products WHERE id = v_product_id;
      IF NOT FOUND THEN
        RAISE EXCEPTION 'A selected free sticker is no longer available.';
      END IF;

      v_order_item_name := v_product.name;
      v_order_item_image := COALESCE(v_product.images[1], v_product.image);
      v_order_item_price := 0;
      v_free_units := v_free_units + v_quantity;
    ELSIF v_is_custom THEN
      IF NULLIF(v_item->>'product_id', '') IS NOT NULL
         OR COALESCE(v_item->>'custom_item_id', '') !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$' THEN
        RAISE EXCEPTION 'Invalid custom sticker reference.';
      END IF;

      v_custom_item_id := (v_item->>'custom_item_id')::UUID;
      SELECT * INTO v_custom_item
        FROM public.checkout_custom_items
       WHERE id = v_custom_item_id
         AND order_id IS NULL
         AND claimed_at IS NULL
         AND user_id IS NOT DISTINCT FROM v_user_id
       FOR UPDATE;
      IF NOT FOUND THEN
        RAISE EXCEPTION 'A custom sticker is no longer available. Please add it to your cart again.';
      END IF;

      v_product_id := NULL;
      v_order_item_name := v_custom_item.name;
      v_order_item_image := v_custom_item.image_data;
      v_order_item_price := 10;
      v_paid_units := v_paid_units + v_quantity;
      v_subtotal := v_subtotal + (v_order_item_price * v_quantity);
      IF NOT (v_custom_item_id = ANY(v_custom_item_ids)) THEN
        v_custom_item_ids := array_append(v_custom_item_ids, v_custom_item_id);
      END IF;
    ELSE
      IF COALESCE(v_item->>'product_id', '') !~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$' THEN
        RAISE EXCEPTION 'Invalid sticker product.';
      END IF;

      v_product_id := (v_item->>'product_id')::UUID;
      SELECT * INTO v_product FROM public.products WHERE id = v_product_id;
      IF NOT FOUND THEN
        RAISE EXCEPTION 'A sticker in your cart is no longer available.';
      END IF;

      v_order_item_name := v_product.name;
      v_order_item_image := COALESCE(v_product.images[1], v_product.image);
      v_order_item_price := v_product.price;
      v_paid_units := v_paid_units + v_quantity;
      v_subtotal := v_subtotal + (v_order_item_price * v_quantity);
    END IF;

    v_order_lines := v_order_lines || jsonb_build_array(jsonb_build_object(
      'product_id', v_product_id,
      'product_name', v_order_item_name,
      'product_image', v_order_item_image,
      'quantity', v_quantity,
      'price', v_order_item_price,
      'finish_type', v_finish_type,
      'is_free_gift', v_is_free_gift,
      'is_custom', v_is_custom
    ));
  END LOOP;

  IF v_paid_units = 0 THEN
    RAISE EXCEPTION 'An order must contain at least one paid sticker.';
  END IF;

  v_gift_allowance := CASE
    WHEN v_paid_units >= 50 THEN 20
    WHEN v_paid_units >= 20 THEN 7
    WHEN v_paid_units >= 10 THEN 3
    WHEN v_paid_units >= 5 THEN 1
    ELSE 0
  END;

  IF v_free_units > v_gift_allowance THEN
    RAISE EXCEPTION 'Selected free stickers exceed the eligible offer of %.', v_gift_allowance;
  END IF;

  IF v_paid_units >= 50 OR v_subtotal >= 500 THEN
    v_shipping := 0;
  ELSE
    v_shipping := CASE p_order->>'governorate'
      WHEN 'Cairo' THEN 65
      WHEN 'Giza' THEN 65
      WHEN 'Qalyubia' THEN 65
      WHEN 'Sharkia' THEN 75
      WHEN 'Alexandria' THEN 75
      WHEN 'Dakahlia' THEN 75
      WHEN 'Gharbia' THEN 75
      WHEN 'Damietta' THEN 75
      WHEN 'Menofia' THEN 75
      WHEN 'Kafr El Sheikh' THEN 75
      WHEN 'Beheira' THEN 75
      WHEN 'Ismailia' THEN 80
      WHEN 'Suez' THEN 85
      WHEN 'Fayoum' THEN 90
      WHEN 'Assiut' THEN 90
      WHEN 'Minya' THEN 90
      WHEN 'Beni Suef' THEN 90
      WHEN 'Aswan' THEN 115
      WHEN 'Luxor' THEN 115
      WHEN 'Red Sea' THEN 115
      WHEN 'Qena' THEN 115
      WHEN 'Sohag' THEN 115
      WHEN 'New Valley' THEN 125
      WHEN 'South Sinai' THEN 125
      WHEN 'Matrouh' THEN 125
      ELSE 65
    END;
  END IF;

  v_coupon_code := NULLIF(UPPER(BTRIM(p_order->>'discount_code')), '');
  IF v_coupon_code IS NOT NULL THEN
    EXECUTE
      'SELECT discount_percent
         FROM public.discount_codes
        WHERE UPPER(code) = $1
          AND active = TRUE
          AND (expires_at IS NULL OR expires_at >= NOW())
        LIMIT 1'
      INTO v_discount_percent
      USING v_coupon_code;

    IF v_discount_percent IS NULL OR v_discount_percent <= 0 OR v_discount_percent > 100 THEN
      RAISE EXCEPTION 'Coupon is invalid or expired.';
    END IF;

    v_discount := ROUND(v_subtotal * v_discount_percent / 100);
  END IF;

  v_total := v_subtotal + v_shipping - v_discount;

  INSERT INTO public.orders (
    user_id, full_name, phone, address, governorate, notes,
    payment_method, payment_proof_url, subtotal, shipping, discount, total, status
  ) VALUES (
    v_user_id,
    BTRIM(p_order->>'full_name'),
    BTRIM(p_order->>'phone'),
    BTRIM(p_order->>'address'),
    BTRIM(p_order->>'governorate'),
    NULLIF(p_order->>'notes', ''),
    p_order->>'payment_method',
    NULLIF(p_order->>'payment_proof_url', ''),
    v_subtotal,
    v_shipping,
    v_discount,
    v_total,
    'pending'
  )
  RETURNING * INTO v_order;

  IF cardinality(v_custom_item_ids) > 0 THEN
    UPDATE public.checkout_custom_items
       SET order_id = v_order.id, claimed_at = NOW()
     WHERE id = ANY(v_custom_item_ids)
       AND order_id IS NULL
       AND claimed_at IS NULL
       AND user_id IS NOT DISTINCT FROM v_user_id;

    GET DIAGNOSTICS v_claimed_custom_count = ROW_COUNT;
    IF v_claimed_custom_count <> cardinality(v_custom_item_ids) THEN
      RAISE EXCEPTION 'A custom sticker was already used by another order.';
    END IF;
  END IF;

  FOR v_item IN SELECT value FROM jsonb_array_elements(v_order_lines)
  LOOP
    INSERT INTO public.order_items (
      order_id, product_id, product_name, product_image,
      quantity, price, finish_type, is_free_gift, is_custom
    ) VALUES (
      v_order.id,
      NULLIF(v_item->>'product_id', '')::UUID,
      v_item->>'product_name',
      v_item->>'product_image',
      (v_item->>'quantity')::INTEGER,
      (v_item->>'price')::NUMERIC(10, 2),
      v_item->>'finish_type',
      (v_item->>'is_free_gift')::BOOLEAN,
      (v_item->>'is_custom')::BOOLEAN
    );
  END LOOP;

  RETURN to_jsonb(v_order);
END;
$$;

REVOKE ALL ON FUNCTION public.create_order_with_items(JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_order_with_items(JSONB) TO anon, authenticated;
