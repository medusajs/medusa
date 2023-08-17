curl -X POST '{backend_url}/admin/store' \
-H 'Authorization: Bearer {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "name": "Medusa Store"
}'
