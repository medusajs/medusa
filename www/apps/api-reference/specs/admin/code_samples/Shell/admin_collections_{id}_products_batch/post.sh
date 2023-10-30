curl -X POST '{backend_url}/admin/collections/{id}/products/batch' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "product_ids": [
        "prod_01G1G5V2MBA328390B5AXJ610F"
    ]
}'
