curl -X POST '{backend_url}/admin/exchanges' \
-H 'Authorization: Bearer {access_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "order_id": "{value}",
  "metadata": {}
}'