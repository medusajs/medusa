curl -X POST '{backend_url}/auth/user/emailpass/update?token=123' \
-H 'Content-Type: application/json' \
--data-raw '{
  "email": "admin@medusa-test.com",
  "password": "supersecret"
}'