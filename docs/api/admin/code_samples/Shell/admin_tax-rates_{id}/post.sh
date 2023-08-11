curl -X POST 'https://medusa-url.com/admin/tax-rates/{id}' \
-H 'Authorization: Bearer {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "name": "New Tax Rate"
}'
