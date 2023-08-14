curl -X DELETE 'https://medusa-url.com/admin/price-lists/{id}/prices/batch' \
-H 'Authorization: Bearer {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "price_ids": [
      "adasfa"
    ]
}'
