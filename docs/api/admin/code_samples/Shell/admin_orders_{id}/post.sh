curl -X POST 'https://medusa-url.com/admin/orders/adasda' \
-H 'Authorization: Bearer {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "email": "user@example.com"
}'
