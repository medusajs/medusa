curl -X POST 'https://medusa-url.com/admin/products/{id}/variants' \
-H 'Authorization: Bearer {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "title": "Color",
    "prices": [
      {
        "amount": 1000,
        "currency_code": "eur"
      }
    ],
    "options": [
      {
        "option_id": "asdasf",
        "value": "S"
      }
    ]
}'
