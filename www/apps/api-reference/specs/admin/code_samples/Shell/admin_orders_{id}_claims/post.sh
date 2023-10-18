curl -X POST '{backend_url}/admin/orders/{id}/claims' \
-H 'x-medusa-access-token: {api_token}' \
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
