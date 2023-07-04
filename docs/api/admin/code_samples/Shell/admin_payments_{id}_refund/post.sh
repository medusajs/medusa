curl --location --request POST 'https://medusa-url.com/admin/payments/pay_123/refund' \
--header 'Authorization: Bearer {api_token}' \
--header 'Content-Type: application/json' \
--data-raw '{
    "amount": 1000,
    "reason": "return",
    "note": "Do not like it"
}'
