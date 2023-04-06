curl --location --request POST 'https://medusa-url.com/admin/store' \
--header 'Authorization: Bearer {api_token}' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Medusa Store"
}'
