curl -X POST 'https://medusa-url.com/store/batch/customer/token' \
-H 'Content-Type: application/json' \
--data-raw '{
    "order_ids": ["id"],
}'
