curl --location --request POST 'https://medusa-url.com/admin/invites' \
--header 'Authorization: Bearer {api_token}' \
--header 'Content-Type: application/json' \
--data-raw '{
    "user": "user@example.com",
    "role": "admin"
}'
