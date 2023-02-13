curl --location --request POST 'https://medusa-url.com/admin/draft-orders' \
--header 'Authorization: Bearer {api_token}' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "user@example.com",
    "region_id": "{region_id}"
    "items": [
       {
         "quantity": 1
       }
    ],
    "shipping_methods": [
       {
         "option_id": "{option_id}"
       }
    ]
}'
