curl -X POST '{backend_url}/store/auth/token' \
-H 'Content-Type: application/json' \
--data-raw '{
  "email": "user@example.com",
  "password": "supersecret"
}'
