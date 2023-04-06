curl --location --request POST 'https://medusa-url.com/admin/customer-groups/{id}' \
--header 'Authorization: Bearer {api_token}' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "VIP"
}'
