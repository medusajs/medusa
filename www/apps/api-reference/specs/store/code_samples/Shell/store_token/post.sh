curl --location --request POST 'https://medusa-url.com/store/auth/token' \
--header 'Content-Type: application/json' \
--data-raw '{
  "email": "user@example.com",
  "password": "supersecret"
}'
