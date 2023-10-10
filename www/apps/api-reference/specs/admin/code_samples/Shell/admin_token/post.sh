curl --location --request POST 'https://medusa-url.com/admin/auth/token' \
--header 'Content-Type: application/json' \
--data-raw '{
  "email": "user@example.com",
  "password": "supersecret"
}'
