curl -X POST 'https://medusa-url.com/store/carts/{id}/shipping-methods' \
-H 'Content-Type: application/json' \
--data-raw '{
    "option_id": "{option_id}",
}'
