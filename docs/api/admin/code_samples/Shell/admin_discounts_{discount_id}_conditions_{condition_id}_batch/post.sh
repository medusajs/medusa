curl --location --request POST 'https://medusa-url.com/admin/discounts/{id}/conditions/{condition_id}/batch' \
--header 'Authorization: Bearer {api_token}' \
--header 'Content-Type: application/json' \
--data-raw '{
    "resources": [{ "id": "item_id" }]
}'
