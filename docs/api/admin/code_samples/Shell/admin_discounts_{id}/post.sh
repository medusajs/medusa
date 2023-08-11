curl -X POST 'https://medusa-url.com/admin/discounts/{id}' \
-H 'Authorization: Bearer {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "code": "TEST"
}'
