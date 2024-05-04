curl -X POST '{backend_url}/admin/notes/{id}' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "value": "We delivered this order"
}'
