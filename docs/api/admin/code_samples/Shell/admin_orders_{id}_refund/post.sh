curl --location --request POST 'https://medusa-url.com/admin/orders/adasda/refund' \
--header 'Authorization: Bearer {api_token}' \
--header 'Content-Type: application/json' \
--data-raw '{
    "amount": 1000,
    "reason": "Do not like it"
}'
