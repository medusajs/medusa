curl -X POST 'https://medusa-url.com/store/customers/password-reset' \
-H 'Content-Type: application/json' \
--data-raw '{
    "email": "user@example.com",
    "password": "supersecret",
    "token": "supersecrettoken"
}'
