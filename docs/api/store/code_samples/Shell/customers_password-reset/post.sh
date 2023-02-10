curl --location --request POST 'https://medusa-url.com/store/customers/password-reset' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email": "user@example.com",
    "password": "supersecret",
    "token": "supersecrettoken"
}'
