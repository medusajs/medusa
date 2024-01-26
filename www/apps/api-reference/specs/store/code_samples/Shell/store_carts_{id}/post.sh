curl -X POST '{backend_url}/store/carts/{id}' \
-H 'Content-Type: application/json' \
--data-raw '{
    "email": "user@example.com"
}'
