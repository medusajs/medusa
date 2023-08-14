curl -X POST '{backend_url}/admin/stock-locations' \
-H 'Authorization: Bearer {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "name": "App"
}'
