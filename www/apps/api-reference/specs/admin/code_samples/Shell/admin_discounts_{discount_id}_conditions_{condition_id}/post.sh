curl -X POST '{backend_url}/admin/discounts/{id}/conditions/{condition}' \
-H 'Authorization: Bearer {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "products": [
       "prod_01G1G5V2MBA328390B5AXJ610F"
    ]
}'
