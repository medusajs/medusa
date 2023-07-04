curl --location --request POST 'https://medusa-url.com/admin/users/{id}' \
--header 'Authorization: Bearer {api_token}' \
--header 'Content-Type: application/json' \
--data-raw '{
    "first_name": "Marcellus"
}'
