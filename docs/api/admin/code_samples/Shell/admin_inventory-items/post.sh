curl -X POST 'https://medusa-url.com/admin/inventory-items' \
-H 'Authorization: Bearer {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "variant_id": "variant_123",
}'
