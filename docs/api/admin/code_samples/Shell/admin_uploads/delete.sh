curl -X DELETE 'https://medusa-url.com/admin/uploads' \
-H 'Authorization: Bearer {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "file_key": "{file_key}"
}'
