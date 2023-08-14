curl -X POST '{backend_url}/admin/shipping-profiles/{id} \
-H 'Authorization: Bearer {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "name": "Large Products"
}'
