curl -X POST '{backend_url}/admin/discounts/{id}/dynamic-codes' \
-H 'Authorization: Bearer {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "code": "TEST"
}'
