curl -X POST '{backend_url}/auth/user/emailpass' \
-H 'Content-Type: application/json' \
--data-raw '{
  "email": "admin@medusa-test.com",
  "password": "supersecret"
}'