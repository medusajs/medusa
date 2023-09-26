curl -X POST '{backend_url}/admin/discounts/{id}' \
-H 'Authorization: Bearer {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "code": "TEST"
}'
