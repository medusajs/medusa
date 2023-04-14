curl --location --request POST 'https://medusa-url.com/admin/orders/{id}/line-items/{line_item_id}/reserve' \
--header 'Authorization: Bearer {api_token}' \
--header 'Content-Type: application/json' \
--data-raw '{
    "location_id": "loc_1"
}'
