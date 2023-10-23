curl -X POST '{backend_url}/admin/auth/token' \
-H 'Content-Type: application/json' \
--data-raw '{
  "email": "user@example.com",
  "password": "supersecret"
}'
