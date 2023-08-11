curl -X POST 'https://medusa-url.com/admin/inventory-items/{id}' \
-H 'Authorization: Bearer {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "origin_country": "US"
}'
