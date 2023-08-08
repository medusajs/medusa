curl -X POST 'https://medusa-url.com/admin/price-lists/{id}/prices/batch' \
-H 'Authorization: Bearer {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "prices": [
      {
        "amount": 100,
        "variant_id": "afasfa",
        "currency_code": "eur"
      }
    ]
}'
