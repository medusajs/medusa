curl -X POST 'https://medusa-url.com/admin/price-lists/{id}' \
-H 'Authorization: Bearer {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "name": "New Price List"
}'
