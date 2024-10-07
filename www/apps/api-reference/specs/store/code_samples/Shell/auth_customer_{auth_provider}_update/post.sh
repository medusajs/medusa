curl -X POST '{backend_url}/auth/customer/emailpass/update?token=123' \
-H 'Content-Type: application/json' \
--data-raw '{
  "email": "customer@gmail.com",
  "password": "supersecret"
}'