curl -X POST '{backend_url}/admin/payment-collections/{id}' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "description": "Description of payment collection"
}'
