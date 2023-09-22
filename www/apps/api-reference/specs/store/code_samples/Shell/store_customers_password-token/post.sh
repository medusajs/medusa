curl -X POST '{backend_url}/store/customers/password-token' \
-H 'Content-Type: application/json' \
--data-raw '{
    "email": "user@example.com"
}'
