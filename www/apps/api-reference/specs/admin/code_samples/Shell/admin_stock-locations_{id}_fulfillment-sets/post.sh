curl -X POST '{backend_url}/admin/stock-locations/{id}/fulfillment-sets' \
-H 'Authorization: Bearer {access_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "name": "Helene",
  "type": "{value}"
}'