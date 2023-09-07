curl -X POST '{backend_url}/admin/users' \
-H 'Authorization: Bearer {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "email": "user@example.com",
    "password": "supersecret"
}'
