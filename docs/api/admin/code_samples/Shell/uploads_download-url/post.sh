curl --location --request POST 'https://medusa-url.com/admin/uploads/download-url' \
--header 'Authorization: Bearer {api_token}' \
--header 'Content-Type: application/json' \
--data-raw '{
    "file_key": "{file_key}"
}'
