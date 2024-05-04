curl -X POST '{backend_url}/admin/users/password-token' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "email": "user@example.com"
}'
