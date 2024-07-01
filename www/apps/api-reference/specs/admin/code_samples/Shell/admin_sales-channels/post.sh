curl -X POST '{backend_url}/admin/sales-channels' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "name": "Linnea",
  "description": "{value}",
  "metadata": {}
}'