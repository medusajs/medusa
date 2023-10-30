curl -X POST '{backend_url}/admin/price-lists/{id}/prices/batch' \
-H 'x-medusa-access-token: {api_token}' \
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
