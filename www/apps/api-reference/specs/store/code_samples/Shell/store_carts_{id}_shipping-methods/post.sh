curl -X POST '{backend_url}/store/carts/{id}/shipping-methods' \
-H 'Content-Type: application/json' \
--data-raw '{
  "option_id": "{value}"
}'