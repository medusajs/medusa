curl --location --request POST 'https://medusa-url.com/admin/inventory-items' \
--header 'Authorization: Bearer {api_token}' \
--header 'Content-Type: application/json' \
--data-raw '{
    "variant_id": "variant_123",
}'
