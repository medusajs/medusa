curl -X POST '{backend_url}/admin/price-lists/{id}' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "name": "New Price List"
}'
