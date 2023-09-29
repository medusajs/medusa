curl -X POST '{backend_url}/admin/users/reset-password' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "token": "supersecrettoken",
    "password": "supersecret"
}'
