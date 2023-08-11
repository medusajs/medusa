curl -X POST 'https://medusa-url.com/admin/batch-jobs' \
-H 'Content-Type: application/json' \
-H 'Authorization: Bearer {api_token}' \
--data-raw '{
    "type": "product-export",
    "context": { }
}'
