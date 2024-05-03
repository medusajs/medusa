curl -X POST '{backend_url}/admin/inventory-items/{id}' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "origin_country": "US"
}'
