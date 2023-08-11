curl -X POST 'https://medusa-url.com/admin/orders/{id}/claims' \
-H 'Authorization: Bearer {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "type": "refund",
    "claim_items": [
      {
        "item_id": "asdsd",
        "quantity": 1
      }
    ]
}'
