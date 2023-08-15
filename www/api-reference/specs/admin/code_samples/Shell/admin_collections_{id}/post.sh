curl -X POST '{backend_url}/admin/collections/{id}' \
-H 'Authorization: Bearer {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "title": "New Collection"
}'
