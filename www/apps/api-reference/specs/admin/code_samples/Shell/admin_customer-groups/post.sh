curl -X POST '{backend_url}/admin/customer-groups' \
-H 'Authorization: Bearer {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "name": "VIP"
}'
