curl -X POST 'https://medusa-url.com/admin/products/{id}/variants/{variant_id}' \
-H 'Authorization: Bearer {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "title": "Color",
    "prices": [
      {
        "amount": 1000,
        "currency_code": "eur"
      }
    ]
}'
