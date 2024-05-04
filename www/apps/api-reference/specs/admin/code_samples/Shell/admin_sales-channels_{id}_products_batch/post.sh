curl -X POST '{backend_url}/admin/sales-channels/{id}/products/batch' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "product_ids": [
      {
        "id": "{product_id}"
      }
    ]
}'
