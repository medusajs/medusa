curl -X POST '{backend_url}/admin/sales-channels/{id}' \
-H 'Authorization: Bearer {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "name": "App"
}'
