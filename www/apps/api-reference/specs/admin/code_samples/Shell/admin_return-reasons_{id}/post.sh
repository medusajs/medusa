curl -X POST '{backend_url}/admin/return-reasons/{id}' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "label": "Damaged"
}'
