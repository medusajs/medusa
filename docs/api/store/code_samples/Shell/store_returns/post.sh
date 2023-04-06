curl --location --request POST 'https://medusa-url.com/store/returns' \
--header 'Content-Type: application/json' \
--data-raw '{
    "order_id": "asfasf",
    "items": [
      {
        "item_id": "assfasf",
        "quantity": 1
      }
    ]
}'
