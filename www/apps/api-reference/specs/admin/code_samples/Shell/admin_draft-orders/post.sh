curl -X POST '{backend_url}/admin/draft-orders' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
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
