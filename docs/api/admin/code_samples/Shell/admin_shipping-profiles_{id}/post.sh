curl --location --request POST 'https://medusa-url.com/admin/shipping-profiles/{id} \
--header 'Authorization: Bearer {api_token}' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "Large Products"
}'
