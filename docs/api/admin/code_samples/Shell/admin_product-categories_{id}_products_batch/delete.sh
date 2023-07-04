curl --location --request DELETE 'https://medusa-url.com/admin/product-categories/{id}/products/batch' \
--header 'Authorization: Bearer {api_token}' \
--header 'Content-Type: application/json' \
--data-raw '{
    "product_ids": [
      {
        "id": "{product_id}"
      }
    ]
}'
