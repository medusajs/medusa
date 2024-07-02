curl -X POST '{backend_url}/store/carts/{id}/promotions' \
-H 'Content-Type: application/json' \
--data-raw '{
  "promo_codes": [
    "{value}"
  ]
}'