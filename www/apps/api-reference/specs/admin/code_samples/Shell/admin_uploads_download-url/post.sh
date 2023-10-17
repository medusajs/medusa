curl -X POST '{backend_url}/admin/uploads/download-url' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "file_key": "{file_key}"
}'
