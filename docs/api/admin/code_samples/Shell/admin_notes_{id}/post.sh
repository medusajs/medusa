curl -X POST 'https://medusa-url.com/admin/notes/{id}' \
-H 'Authorization: Bearer {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "value": "We delivered this order"
}'
