curl -X POST '{backend_url}/admin/product-categories/{id}' \
-H 'Authorization: Bearer {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "name": "Skinny Jeans"
}'
