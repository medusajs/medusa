curl -X POST 'https://medusa-url.com/admin/stock-locations/{id}' \
-H 'Authorization: Bearer {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "name": "Main Warehouse"
}'
