curl --location --request POST 'https://medusa-url.com/admin/payment-collections/{id}' \
--header 'Authorization: Bearer {api_token}' \
--header 'Content-Type: application/json' \
--data-raw '{
    "description": "Description of payCol"
}'
