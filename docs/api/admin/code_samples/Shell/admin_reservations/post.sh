curl --location --request POST 'https://medusa-url.com/admin/reservations' \
--header 'Authorization: Bearer {api_token}' \
--header 'Content-Type: application/json' \
--data-raw '{
    "line_item_id": "item_123",
    "location_id": "loc_123",
    "inventory_item_id": "iitem_123",
    "quantity": 1
}'
