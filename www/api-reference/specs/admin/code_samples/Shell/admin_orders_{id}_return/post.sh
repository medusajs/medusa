curl -X POST 'https://medusa-url.com/admin/orders/{id}/return' \
-H 'Authorization: Bearer {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "items": [
      {
        "item_id": "{item_id}",
        "quantity": 1
      }
    ]
}'
