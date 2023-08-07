curl -X POST 'https://medusa-url.com/store/orders/customer/confirm' \
-H 'Content-Type: application/json' \
--data-raw '{
    "token": "{token}",
}'
