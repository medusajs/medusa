curl --location --request POST 'https://medusa-url.com/admin/stock-locations/{id}' \
--header 'Authorization: Bearer {api_token}' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "App"
}'
