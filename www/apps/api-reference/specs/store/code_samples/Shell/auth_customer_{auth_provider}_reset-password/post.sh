curl -X POST '{backend_url}/auth/customer/emailpass/reset-password' \
-H 'Content-Type: application/json' \
--data-raw '{
  "identifier": "customer@gmail.com"
}'