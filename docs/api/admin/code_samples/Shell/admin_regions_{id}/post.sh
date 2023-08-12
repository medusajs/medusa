curl -X POST 'https://medusa-url.com/admin/regions/{id}' \
-H 'Authorization: Bearer {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "name": "Europe"
}'
