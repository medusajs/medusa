curl --location --request POST 'https://medusa-url.com/admin/collections' \
--header 'Authorization: Bearer {api_token}' \
--header 'Content-Type: application/json' \
--data-raw '{
    "title": "New Collection"
}'
