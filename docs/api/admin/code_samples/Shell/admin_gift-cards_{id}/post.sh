curl --location --request POST 'https://medusa-url.com/admin/gift-cards/{id}' \
--header 'Authorization: Bearer {api_token}' \
--header 'Content-Type: application/json' \
--data-raw '{
    "region_id": "{region_id}"
}'
