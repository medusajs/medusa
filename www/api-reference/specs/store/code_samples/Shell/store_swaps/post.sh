curl --location --request POST 'https://medusa-url.com/store/swaps' \
--header 'Content-Type: application/json' \
--data-raw '{
    "order_id": "asfasf",
    "return_items": [
      {
        "item_id": "asfas",
        "quantity": 1
      }
    ],
    "additional_items": [
      {
        "variant_id": "asfas",
        "quantity": 1
      }
    ]
}'
