curl --location --request POST 'https://medusa-url.com/admin/shipping-options/{id}' \
--header 'Authorization: Bearer {api_token}' \
--header 'Content-Type: application/json' \
--data-raw '{
    "requirements": [
      {
        "type": "max_subtotal",
        "amount": 1000
      }
    ]
}'
