curl --location --request POST 'https://medusa-url.com/store/customers' \
--header 'Content-Type: application/json' \
--data-raw '{
    "first_name": "Alec",
    "last_name": "Reynolds",
    "email": "user@example.com",
    "password": "supersecret"
}'
