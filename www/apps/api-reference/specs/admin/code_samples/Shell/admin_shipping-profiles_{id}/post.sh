curl -X POST '{backend_url}/admin/shipping-profiles/{id} \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "name": "Large Products"
}'
