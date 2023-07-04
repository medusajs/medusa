curl --location --request POST 'https://medusa-url.com/store/carts/{id}/shipping-methods' \
--header 'Content-Type: application/json' \
--data-raw '{
    "option_id": "{option_id}",
}'
