curl --location --request POST 'https://medusa-url.com/admin/tax-rates/{id}' \
--header 'Authorization: Bearer {api_token}' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "New Tax Rate"
}'
