curl -X POST '{backend_url}/admin/sales-channels' \
-H 'Authorization: Bearer {access_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "name": "Linnea",
  "description": "{value}",
  "metadata": {}
}'