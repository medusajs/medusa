curl --location --request POST 'https://medusa-url.com/admin/regions' \
--header 'Authorization: Bearer {api_token}' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Europe",
    "currency_code": "eur",
    "tax_rate": 0,
    "payment_providers": [
      "manual"
    ],
    "fulfillment_providers": [
      "manual"
    ],
    "countries": [
      "DK"
    ]
}'
