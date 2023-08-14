curl -X POST '{backend_url}/admin/invites' \
-H 'Authorization: Bearer {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "user": "user@example.com",
    "role": "admin"
}'
