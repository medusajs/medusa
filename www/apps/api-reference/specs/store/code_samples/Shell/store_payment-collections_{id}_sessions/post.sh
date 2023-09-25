curl -X POST '{backend_url}/store/payment-collections/{id}/sessions' \
-H 'Content-Type: application/json' \
--data-raw '{
  "provider_id": "stripe"
}'
