curl -X POST '{backend_url}/admin/sales-channels/{id}/stock-locations' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "locaton_id": "loc_123"
}'
