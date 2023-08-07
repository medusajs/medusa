curl -X POST 'https://medusa-url.com/admin/return-reasons' \
-H 'Authorization: Bearer {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "label": "Damaged",
    "value": "damaged"
}'
