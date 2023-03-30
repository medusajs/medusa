curl --location --request POST 'https://medusa-url.com/admin/draft-orders/{id}/line-items' \
--header 'Authorization: Bearer {api_token}' \
--header 'Content-Type: application/json' \
--data-raw '{
    "quantity": 1
}'
