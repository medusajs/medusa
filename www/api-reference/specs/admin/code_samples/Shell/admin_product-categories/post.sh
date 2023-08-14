curl -X POST '{backend_url}/admin/product-categories' \
-H 'Authorization: Bearer {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "name": "Skinny Jeans"
}'
