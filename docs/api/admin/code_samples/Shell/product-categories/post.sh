curl --location --request POST 'https://medusa-url.com/admin/product-categories' \
--header 'Authorization: Bearer {api_token}' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Skinny Jeans",
}'
