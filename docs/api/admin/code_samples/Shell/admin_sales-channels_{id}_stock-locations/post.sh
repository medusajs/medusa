curl -X POST 'https://medusa-url.com/admin/sales-channels/{id}/stock-locations' \
-H 'Authorization: Bearer {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "locaton_id": "loc_123"
}'
