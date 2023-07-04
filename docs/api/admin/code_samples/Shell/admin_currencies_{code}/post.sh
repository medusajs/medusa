curl --location --request POST 'https://medusa-url.com/admin/currencies/{code}' \
--header 'Authorization: Bearer {api_token}' \
--header 'Content-Type: application/json' \
--data-raw '{
    "includes_tax": true
}'
