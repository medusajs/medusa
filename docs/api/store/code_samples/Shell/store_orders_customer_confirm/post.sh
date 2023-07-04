curl --location --request POST 'https://medusa-url.com/store/orders/customer/confirm' \
--header 'Content-Type: application/json' \
--data-raw '{
    "token": "{token}",
}'
