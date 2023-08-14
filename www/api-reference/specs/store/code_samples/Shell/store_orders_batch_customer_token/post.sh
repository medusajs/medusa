curl -X POST '{backend_url}/store/batch/customer/token' \
-H 'Content-Type: application/json' \
--data-raw '{
    "order_ids": ["id"],
}'
