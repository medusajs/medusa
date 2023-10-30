curl -X POST '{backend_url}/admin/invites' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "user": "user@example.com",
    "role": "admin"
}'
