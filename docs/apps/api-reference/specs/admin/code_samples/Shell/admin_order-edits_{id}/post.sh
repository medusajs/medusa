curl -X POST '{backend_url}/admin/order-edits/{id}' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "internal_note": "internal reason XY"
}'
