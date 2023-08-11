curl -X POST 'https://medusa-url.com/store/carts/{id}/line-items' \
-H 'Content-Type: application/json' \
--data-raw '{
    "variant_id": "{variant_id}",
    "quantity": 1
}'
