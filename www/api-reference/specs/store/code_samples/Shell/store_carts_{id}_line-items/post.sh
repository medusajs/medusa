curl --location --request POST 'https://medusa-url.com/store/carts/{id}/line-items' \
--header 'Content-Type: application/json' \
--data-raw '{
    "variant_id": "{variant_id}",
    "quantity": 1
}'
