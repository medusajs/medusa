curl -X POST '{backend_url}/admin/price-lists/{id}' \
-H 'Authorization: Bearer {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "name": "New Price List"
}'
