curl --location --request POST 'https://medusa-url.com/admin/price-lists/{id}/prices/batch' \
--header 'Authorization: Bearer {api_token}' \
--header 'Content-Type: application/json' \
--data-raw '{
    "prices": [
      {
        "amount": 100,
        "variant_id": "afasfa",
        "currency_code": "eur"
      }
    ]
}'
