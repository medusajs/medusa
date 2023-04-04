curl --location --request POST 'https://medusa-url.com/admin/orders/{id}/swaps' \
--header 'Authorization: Bearer {api_token}' \
--header 'Content-Type: application/json' \
--data-raw '{
    "return_items": [
      {
        "item_id": "asfasf",
        "quantity": 1
      }
    ]
}'
