curl -X POST '{backend_url}/admin/draft-orders/{id}/line-items' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "quantity": 1
}'
