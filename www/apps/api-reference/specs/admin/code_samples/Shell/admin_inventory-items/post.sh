curl -X POST '{backend_url}/admin/inventory-items' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "variant_id": "variant_123",
}'
