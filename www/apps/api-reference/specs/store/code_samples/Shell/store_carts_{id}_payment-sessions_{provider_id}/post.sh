curl -X POST '{backend_url}/store/carts/{id}/payment-sessions/manual' \
-H 'Content-Type: application/json' \
--data-raw '{
    "data": {}
}'
