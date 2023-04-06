curl --location --request POST 'https://medusa-url.com/admin/products/{id}/options/{option_id}' \
--header 'Authorization: Bearer {api_token}' \
--header 'Content-Type: application/json' \
--data-raw '{
    "title": "Size"
}'
