curl --location --request POST 'https://medusa-url.com/admin/sales-channels/{id}/stock-locations' \
--header 'Authorization: Bearer {api_token}' \
--header 'Content-Type: application/json' \
--data-raw '{
    "locaton_id": "stock_location_id"
}'
