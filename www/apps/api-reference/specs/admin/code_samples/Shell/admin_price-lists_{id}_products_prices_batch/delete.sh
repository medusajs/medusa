curl -X DELETE '{backend_url}/admin/price-lists/{id}/products/prices/batch' \
-H 'Authorization: Bearer {api_token}'
-H 'Content-Type: application/json' \
--data-raw '{
    "product_ids": [
      "prod_1",
      "prod_2"
    ]
}'
