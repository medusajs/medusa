curl --location --request POST 'https://medusa-url.com/store/carts/{id}/line-items/{line_id}' \
--header 'Content-Type: application/json' \
--data-raw '{
    "quantity": 1
}'
