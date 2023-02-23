curl --location --request POST 'https://medusa-url.com/admin/orders/{id}/fulfillment' \
--header 'Authorization: Bearer {api_token}' \
--header 'Content-Type: application/json' \
--data-raw '{
    "items": [
      {
        "item_id": "{item_id}",
        "quantity": 1
      }
    ]
}'
