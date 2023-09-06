curl -X POST '{backend_url}/admin/discounts/{id}/conditions' \
-H 'Authorization: Bearer {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "operator": "in"
}'
