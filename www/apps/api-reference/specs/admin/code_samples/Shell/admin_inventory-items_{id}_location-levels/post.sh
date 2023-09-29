curl -X POST '{backend_url}/admin/inventory-items/{id}/location-levels' \
-H 'Authorization: Bearer {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "location_id": "sloc_123",
    "stocked_quantity": 10
}'
