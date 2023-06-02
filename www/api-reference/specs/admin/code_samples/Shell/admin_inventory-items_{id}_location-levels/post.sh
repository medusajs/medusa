curl --location --request POST 'https://medusa-url.com/admin/inventory-items/{id}/location-levels' \
--header 'Authorization: Bearer {api_token}' \
--header 'Content-Type: application/json' \
--data-raw '{
    "location_id": "sloc_123",
    "stocked_quantity": 10
}'
