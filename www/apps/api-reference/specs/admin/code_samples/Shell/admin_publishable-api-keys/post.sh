curl -X POST '{backend_url}/admin/publishable-api-keys' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "title": "Web API Key"
}'
