curl -X POST 'https://medusa-url.com/store/returns' \
-H 'Content-Type: application/json' \
--data-raw '{
    "order_id": "asfasf",
    "items": [
      {
        "item_id": "assfasf",
        "quantity": 1
      }
    ]
}'
