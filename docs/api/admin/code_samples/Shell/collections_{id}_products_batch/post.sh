curl --location --request POST 'https://medusa-url.com/admin/collections/{id}/products/batch' \
--header 'Authorization: Bearer {api_token}' \
--header 'Content-Type: application/json' \
--data-raw '{
    "product_ids": [
        "prod_01G1G5V2MBA328390B5AXJ610F"
    ]
}'
