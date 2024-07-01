curl -X POST '{backend_url}/admin/stock-locations' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "name": "Maryam",
  "address_id": "{value}",
  "metadata": {}
}'