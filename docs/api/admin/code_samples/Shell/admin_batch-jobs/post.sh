curl --location --request POST 'https://medusa-url.com/admin/batch-jobs' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer {api_token}' \
--data-raw '{
    "type": "product-export",
    "context": { }
}'
