curl -X POST '{backend_url}/store/payment-collections/{id}/payment-sessions/{session_id}' \
-H 'x-publishable-api-key: {your_publishable_api_key}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "client_data": {}
}'