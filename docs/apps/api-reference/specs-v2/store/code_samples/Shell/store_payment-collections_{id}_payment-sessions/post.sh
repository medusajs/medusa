curl -X POST '{backend_url}/store/payment-collections/{id}/payment-sessions' \
-H 'Content-Type: application/json' \
--data-raw '{
  "provider_id": "{value}"
}'