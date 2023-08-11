curl -X POST 'https://medusa-url.com/admin/publishable-api-keys' \
-H 'Authorization: Bearer {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "title": "Web API Key"
}'
