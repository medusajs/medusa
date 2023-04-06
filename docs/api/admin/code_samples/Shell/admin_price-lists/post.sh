curl --location --request POST 'https://medusa-url.com/admin/price-lists' \
--header 'Authorization: Bearer {api_token}' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "New Price List",
    "description": "A new price list",
    "type": "sale",
    "prices": [
      {
        "amount": 1000,
        "variant_id": "afafa",
        "currency_code": "eur"
      }
    ]
}'
