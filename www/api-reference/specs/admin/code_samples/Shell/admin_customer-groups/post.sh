curl -X POST 'https://medusa-url.com/admin/customer-groups' \
-H 'Authorization: Bearer {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "name": "VIP"
}'
