curl -X POST '{backend_url}/admin/products/{id}/metadata' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "key": "test",
    "value": "true"
}'
