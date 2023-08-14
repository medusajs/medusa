curl -X POST 'https://medusa-url.com/store/payment-collections/{id}/sessions' \
-H 'Content-Type: application/json' \
--data-raw '{
  "provider_id": "stripe"
}'
