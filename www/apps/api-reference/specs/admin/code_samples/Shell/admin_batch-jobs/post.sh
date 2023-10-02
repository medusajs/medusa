curl -X POST '{backend_url}/admin/batch-jobs' \
-H 'Content-Type: application/json' \
-H 'x-medusa-access-token: {api_token}' \
--data-raw '{
    "type": "product-export",
    "context": { }
}'
