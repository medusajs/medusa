curl -X POST 'https://medusa-url.com/admin/uploads/download-url' \
-H 'Authorization: Bearer {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "file_key": "{file_key}"
}'
