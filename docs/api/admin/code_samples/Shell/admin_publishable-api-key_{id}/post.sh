curl -X POST 'https://medusa-url.com/admin/publishable-api-key/{id}' \
-H 'Authorization: Bearer {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "title": "new title"
}'
