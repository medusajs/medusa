curl -X POST '{backend_url}/store/customers/password-reset' \
-H 'Content-Type: application/json' \
--data-raw '{
    "email": "user@example.com",
    "password": "supersecret",
    "token": "supersecrettoken"
}'
