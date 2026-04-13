

## Legend

- `pk` — Primary Key  
- `fk` — Foreign Key  
- `int` — Integer  

---

## ER Diagram Design Decisions

- `products` are divided into categories — allowing flexibility for different types of items.

- Product details include all necessary attributes for both UI display and backend tracking, with `product_id` as the identifier. `is_avail` indicates availability.

- Since this system originates from Instagram:
  - `instagram_username` is stored at the customer level  
  - `dm_reference_link` is stored at the order level  
  This helps the store owner trace orders back to Instagram DMs.

- Inspired by Amazon, `order_items` captures `unit_price_at_purchase`.  
  This ensures that even if product prices change later, past orders and revenue calculations remain accurate.

- Customer addresses are separated into a `customer_addresses` table:
  - Avoids duplication when multiple customers share the same address  
  - Supports multiple addresses per customer  
  - Allows a default address using `is_default = true`  
  - Assumes single-country operation, so `country` is omitted  

- To support both thrift and handmade items, a `product_variants` table is introduced instead of attaching stock directly to `products`:
  - Thrift items → single variant with `quantity_in_stock = 1`  
  - Handmade items → multiple variants (e.g., size, color, quantity)  
  - `variant_id` in `order_items` ensures precise SKU tracking  
  - `variant_price` can override `base_price` for special cases  

- `handmade_details` includes attributes like production time or `made_to_order`  
  → Helps communicate effort and justify pricing  

- `thrifted_details` includes:
  - condition  
  - original brand  
  - source  
  → Builds trust and supports pricing justification  

- The `payments` table captures all required transaction details, including `transaction_ref` for record-keeping and dispute handling.

- After ordering, shipping may be handled by a third-party service:
  - `address_id` is required to link delivery details  
```
