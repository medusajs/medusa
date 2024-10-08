curl -X POST '{backend_url}/store/payment-collections/{id}/payment-sessions' \
-H 'Content-Type: application/json' \ \
-H 'x-publishable-api-key: {your_publishable_api_key}'
--data-raw '{
  "provider_id": "{value}"
}'