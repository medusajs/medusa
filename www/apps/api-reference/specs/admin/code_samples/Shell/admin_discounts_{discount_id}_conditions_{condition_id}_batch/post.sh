curl -X POST '{backend_url}/admin/discounts/{id}/conditions/{condition_id}/batch' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "resources": [{ "id": "item_id" }]
}'
