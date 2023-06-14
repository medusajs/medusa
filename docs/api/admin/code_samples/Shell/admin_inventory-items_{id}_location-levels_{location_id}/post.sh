curl --location --request POST 'https://medusa-url.com/admin/inventory-items/{id}/location-levels/{location_id}' \
--header 'Authorization: Bearer {api_token}' \
--header 'Content-Type: application/json' \
--data-raw '{
    "stocked_quantity": 15
}'
