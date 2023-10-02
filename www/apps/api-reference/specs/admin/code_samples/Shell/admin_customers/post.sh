curl -X POST '{backend_url}/admin/customers' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "email": "user@example.com",
    "first_name": "Caterina",
    "last_name": "Yost",
    "password": "supersecret"
}'
