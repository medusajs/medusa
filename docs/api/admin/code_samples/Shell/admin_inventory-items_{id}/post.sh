curl --location --request POST 'https://medusa-url.com/admin/inventory-items/{id}' \
--header 'Authorization: Bearer {api_token}' \
--header 'Content-Type: application/json' \
--data-raw '{
    "origin_country": "US"
}'
