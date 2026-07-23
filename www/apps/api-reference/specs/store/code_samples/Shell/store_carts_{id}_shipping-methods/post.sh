curl -X POST '{backend_url}/store/carts/{id}/shipping-methods' \
-H 'Content-Type: application/json' \
-H 'x-publishable-api-key: {your_publishable_api_key}' \
--data-raw '{
  "option_id": "{value}"
}'