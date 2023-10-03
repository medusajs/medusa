curl -X POST '{backend_url}/admin/payments/pay_123/refund' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "amount": 1000,
    "reason": "return",
    "note": "Do not like it"
}'
