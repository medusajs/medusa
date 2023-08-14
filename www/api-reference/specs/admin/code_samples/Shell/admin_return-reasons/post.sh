curl -X POST '{backend_url}/admin/return-reasons' \
-H 'Authorization: Bearer {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "label": "Damaged",
    "value": "damaged"
}'
