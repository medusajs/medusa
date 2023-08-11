curl -X POST 'https://medusa-url.com/admin/inventory-items/{id}/location-levels/{location_id}' \
-H 'Authorization: Bearer {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "stocked_quantity": 15
}'
