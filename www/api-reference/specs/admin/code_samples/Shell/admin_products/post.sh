curl -X POST '{backend_url}/admin/products' \
-H 'Authorization: Bearer {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "title": "Shirt"
}'
