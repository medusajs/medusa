curl -X POST '{backend_url}/admin/stock-locations/{id}' \
-H 'Authorization: Bearer {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "name": "Main Warehouse"
}'
