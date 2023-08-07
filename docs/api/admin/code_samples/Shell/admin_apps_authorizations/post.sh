curl -X POST 'https://medusa-url.com/admin/apps/authorizations' \
-H 'Authorization: Bearer {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "application_name": "example",
    "state": "ready",
    "code": "token"
}'
