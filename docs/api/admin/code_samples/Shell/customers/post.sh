curl --location --request POST 'https://medusa-url.com/admin/customers' \
--header 'Authorization: Bearer {api_token}' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "user@example.com",
    "first_name": "Caterina",
    "last_name": "Yost",
    "password": "supersecret"
}'
