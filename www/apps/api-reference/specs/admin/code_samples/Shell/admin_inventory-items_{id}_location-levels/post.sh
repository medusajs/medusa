curl -X POST '{backend_url}/admin/inventory-items/{id}/location-levels' \
-H 'Authorization: Bearer {access_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "location_id": "{value}"
}'