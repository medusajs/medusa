curl -X POST '{backend_url}/admin/customers' \
-H 'Authorization: Bearer {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "email": "user@example.com",
    "first_name": "Caterina",
    "last_name": "Yost",
    "password": "supersecret"
}'
