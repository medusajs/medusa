curl -X POST '{backend_url}/store/swaps' \
-H 'Content-Type: application/json' \
--data-raw '{
    "order_id": "{order_id}",
    "return_items": [
      {
        "item_id": "{item_id}",
        "quantity": 1
      }
    ],
    "additional_items": [
      {
        "variant_id": "{variant_id}",
        "quantity": 1
      }
    ]
}'
