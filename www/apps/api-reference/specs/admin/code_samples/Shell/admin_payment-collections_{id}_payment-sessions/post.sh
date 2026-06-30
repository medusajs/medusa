curl -X POST '{backend_url}/admin/payment-collections/{id}/payment-sessions' \
-H 'Authorization: Bearer {access_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "provider_id": "{value}"
}'