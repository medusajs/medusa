curl -X POST '{backend_url}/admin/orders/{id}/shipping-methods' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "price": 1000,
    "option_id": "{option_id}"
}'
