curl --location --request POST 'https://medusa-url.com/admin/return-reasons' \
--header 'Authorization: Bearer {api_token}' \
--header 'Content-Type: application/json' \
--data-raw '{
    "label": "Damaged",
    "value": "damaged"
}'
