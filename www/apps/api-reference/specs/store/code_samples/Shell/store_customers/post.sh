curl -X POST '{backend_url}/store/customers' \
-H 'Content-Type: application/json' \
--data-raw '{
    "first_name": "Alec",
    "last_name": "Reynolds",
    "email": "user@example.com",
    "password": "supersecret"
}'
