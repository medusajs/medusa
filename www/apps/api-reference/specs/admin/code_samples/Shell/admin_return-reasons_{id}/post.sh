curl -X POST '{backend_url}/admin/return-reasons/{id}' \
-H 'Authorization: Bearer {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "label": "Damaged"
}'
