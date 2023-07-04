curl --location --request POST 'https://medusa-url.com/admin/draft-orders/{id}/line-items/{line_id}' \
--header 'Authorization: Bearer {api_token}' \
--header 'Content-Type: application/json' \
--data-raw '{
    "quantity": 1
}'
