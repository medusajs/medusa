curl -X POST 'https://medusa-url.com/admin/payment-collections/{id}' \
-H 'Authorization: Bearer {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "description": "Description of payment collection"
}'
