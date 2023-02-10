curl --location --request POST 'https://medusa-url.com/admin/returns/{id}/receive' \
--header 'Authorization: Bearer {api_token}' \
--header 'Content-Type: application/json' \
--data-raw '{
    "items": [
      {
        "item_id": "asafg",
        "quantity": 1
      }
    ]
}'
