curl -X POST '{backend_url}/admin/claims' \
-H 'Authorization: Bearer {access_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "type": "{value}",
  "order_id": "{value}",
  "metadata": {}
}'