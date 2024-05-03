curl -X POST '{backend_url}/admin/products/{id}/variants/{variant_id}' \
-H 'x-medusa-access-token: {api_token}' \
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
