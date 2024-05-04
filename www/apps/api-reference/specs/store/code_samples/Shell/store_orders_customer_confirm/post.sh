curl -X POST '{backend_url}/store/orders/customer/confirm' \
-H 'Content-Type: application/json' \
--data-raw '{
    "token": "{token}",
}'
