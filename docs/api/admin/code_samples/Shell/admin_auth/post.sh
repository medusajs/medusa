curl -X POST 'https://medusa-url.com/admin/auth' \
-H 'Content-Type: application/json' \
--data-raw '{
  "email": "user@example.com",
  "password": "supersecret"
}'
