curl -X POST 'https://medusa-url.com/admin/products/{id}/options' \
-H 'Authorization: Bearer {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "title": "Size"
}'
