curl -X POST '{backend_url}/admin/stock-locations/{id}' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "address_id": "{value}",
  "metadata": {}
}'