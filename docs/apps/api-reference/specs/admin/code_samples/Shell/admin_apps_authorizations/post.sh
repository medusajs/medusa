curl -X POST '{backend_url}/admin/apps/authorizations' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "application_name": "example",
    "state": "ready",
    "code": "token"
}'
