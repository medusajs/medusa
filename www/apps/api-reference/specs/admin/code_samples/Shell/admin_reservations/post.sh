curl -X POST '{backend_url}/admin/reservations' \
-H 'Authorization: Bearer {access_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "line_item_id": "{value}",
  "location_id": "{value}",
  "inventory_item_id": "{value}",
  "quantity": 3268935814217728,
  "description": "{value}",
  "metadata": {}
}'