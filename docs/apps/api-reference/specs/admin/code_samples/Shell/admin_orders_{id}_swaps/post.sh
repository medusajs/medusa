curl -X POST '{backend_url}/admin/orders/{id}/swaps' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "return_items": [
      {
        "item_id": "asfasf",
        "quantity": 1
      }
    ]
}'
