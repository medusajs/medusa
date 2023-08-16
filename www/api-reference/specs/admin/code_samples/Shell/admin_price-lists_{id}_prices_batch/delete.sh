curl -X DELETE '{backend_url}/admin/price-lists/{id}/prices/batch' \
-H 'Authorization: Bearer {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "price_ids": [
      "adasfa"
    ]
}'
