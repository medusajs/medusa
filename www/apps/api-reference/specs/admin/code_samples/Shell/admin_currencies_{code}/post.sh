curl -X POST '{backend_url}/admin/currencies/{code}' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "includes_tax": true
}'
