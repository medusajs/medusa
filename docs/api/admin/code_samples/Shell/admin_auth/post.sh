curl --location --request POST 'https://medusa-url.com/admin/auth' \
--header 'Content-Type: application/json' \
--data-raw '{
  "email": "user@example.com",
  "password": "supersecret"
}'
