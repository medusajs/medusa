curl -X POST 'https://medusa-url.com/admin/notes' \
-H 'Authorization: Bearer {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "resource_id": "{resource_id}",
    "resource_type": "order",
    "value": "We delivered this order"
}'
