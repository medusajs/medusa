curl -X POST 'https://medusa-url.com/admin/draft-orders/{id}/line-items' \
-H 'Authorization: Bearer {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "quantity": 1
}'
