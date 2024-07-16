curl -X POST '{backend_url}/admin/stock-locations/{id}/fulfillment-sets' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "name": "Velma",
  "type": "{value}"
}'