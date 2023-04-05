curl --location --request POST 'https://medusa-url.com/admin/products/{id}/variants' \
--header 'Authorization: Bearer {api_token}' \
--header 'Content-Type: application/json' \
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
