curl -X POST '{backend_url}/admin/gift-cards/{id}' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "region_id": "{region_id}"
}'
