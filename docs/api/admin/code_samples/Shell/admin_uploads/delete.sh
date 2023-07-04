curl --location --request DELETE 'https://medusa-url.com/admin/uploads' \
--header 'Authorization: Bearer {api_token}' \
--header 'Content-Type: application/json' \
--data-raw '{
    "file_key": "{file_key}"
}'
