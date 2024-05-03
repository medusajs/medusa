curl -X DELETE '{backend_url}/admin/uploads' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "file_key": "{file_key}"
}'
