curl -X POST '{backend_url}/admin/notes' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "resource_id": "{resource_id}",
    "resource_type": "order",
    "value": "We delivered this order"
}'
