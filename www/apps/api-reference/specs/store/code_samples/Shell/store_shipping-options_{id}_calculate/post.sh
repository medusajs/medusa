curl -X POST '{backend_url}/store/shipping-options/{id}/calculate' \
-H 'x-publishable-api-key: {your_publishable_api_key}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "cart_id": "cart_123"
}'