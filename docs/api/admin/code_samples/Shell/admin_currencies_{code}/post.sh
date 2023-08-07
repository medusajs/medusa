curl -X POST 'https://medusa-url.com/admin/currencies/{code}' \
-H 'Authorization: Bearer {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "includes_tax": true
}'
