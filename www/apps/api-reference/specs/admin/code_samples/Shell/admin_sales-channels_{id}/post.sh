curl -X POST '{backend_url}/admin/sales-channels/{id}' \
-H 'Authorization: Bearer {access_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "description": "{value}",
  "metadata": {}
}'