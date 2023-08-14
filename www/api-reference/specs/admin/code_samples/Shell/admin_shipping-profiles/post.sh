curl -X POST '{backend_url}/admin/shipping-profiles' \
-H 'Authorization: Bearer {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "name": "Large Products"
}'
