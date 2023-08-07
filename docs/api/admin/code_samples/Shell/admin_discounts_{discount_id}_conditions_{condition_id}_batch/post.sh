curl -X POST 'https://medusa-url.com/admin/discounts/{id}/conditions/{condition_id}/batch' \
-H 'Authorization: Bearer {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "resources": [{ "id": "item_id" }]
}'
