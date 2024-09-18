curl -X POST '{backend_url}/admin/orders/{id}/archive' \
-H 'Authorization: Bearer {access_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "order_id": "{value}"
}'