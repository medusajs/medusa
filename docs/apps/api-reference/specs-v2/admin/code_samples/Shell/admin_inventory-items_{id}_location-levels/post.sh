curl -X POST '{backend_url}/admin/inventory-items/{id}/location-levels' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "location_id": "{value}",
  "stocked_quantity": 1506469662949376
}'