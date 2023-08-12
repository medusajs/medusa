curl -X POST 'https://medusa-url.com/admin/users/password-token' \
-H 'Authorization: Bearer {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "email": "user@example.com"
}'
