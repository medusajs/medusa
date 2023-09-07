curl -X POST '{backend_url}/admin/orders/{id}/line-items/{line_item_id}/reserve' \
-H 'Authorization: Bearer {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "location_id": "loc_1"
}'
