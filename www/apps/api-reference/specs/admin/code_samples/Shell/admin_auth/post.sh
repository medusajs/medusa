curl -X POST '{backend_url}/admin/auth' \
-H 'Content-Type: application/json' \
--data-raw '{
  "email": "user@example.com",
  "password": "supersecret"
}'
