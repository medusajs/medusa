curl --location \
--request POST 'https://medusa-url.com/admin/product-categories/{product_category_id}/products/batch' \
--header 'Authorization: Bearer {api_token}' \
--header 'Content-Type: application/json' \
--data-raw '{
    "product_ids": [
      {
        "id": "{product_id}"
      }
    ]
}'
