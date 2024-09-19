curl -X POST '{backend_url}/admin/payment-collections/{id}/mark-as-paid' \
-H 'Authorization: Bearer {access_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "order_id": "{value}"
}'