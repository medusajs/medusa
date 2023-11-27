curl -X POST '{backend_url}/admin/discounts/{id}/dynamic-codes' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "code": "TEST"
}'
