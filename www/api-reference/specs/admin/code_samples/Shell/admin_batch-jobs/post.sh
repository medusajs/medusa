curl -X POST '{backend_url}/admin/batch-jobs' \
-H 'Content-Type: application/json' \
-H 'Authorization: Bearer {api_token}' \
--data-raw '{
    "type": "product-export",
    "context": { }
}'
