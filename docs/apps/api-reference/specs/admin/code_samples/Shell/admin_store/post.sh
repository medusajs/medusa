curl -X POST '{backend_url}/admin/store' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "name": "Medusa Store"
}'
