curl --location --request POST 'https://medusa-url.com/admin/orders/{id}/shipping-methods' \
--header 'Authorization: Bearer {api_token}' \
--header 'Content-Type: application/json' \
--data-raw '{
    "price": 1000,
    "option_id": "{option_id}"
}'
