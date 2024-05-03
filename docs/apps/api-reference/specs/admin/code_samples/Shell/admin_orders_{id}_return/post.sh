curl -X POST '{backend_url}/admin/orders/{id}/return' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "items": [
      {
        "item_id": "{item_id}",
        "quantity": 1
      }
    ]
}'
