curl -X POST 'https://medusa-url.com/admin/orders/{id}/swaps' \
-H 'Authorization: Bearer {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "return_items": [
      {
        "item_id": "asfasf",
        "quantity": 1
      }
    ]
}'
