curl -X POST '{backend_url}/store/carts/{id}/promotions' \
-H 'Content-Type: application/json' \ \
-H 'x-publishable-api-key: {your_publishable_api_key}'
--data-raw '{
  "promo_codes": [
    "{value}"
  ]
}'