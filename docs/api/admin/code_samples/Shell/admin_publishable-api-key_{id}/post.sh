curl --location --request POST 'https://medusa-url.com/admin/publishable-api-key/{pka_id}' \
--header 'Authorization: Bearer {api_token}' \
--header 'Content-Type: application/json' \
--data-raw '{
    "title": "new title"
}'
