curl -X POST '{backend_url}/auth/user/emailpass/reset-password' \
-H 'Content-Type: application/json' \
--data-raw '{
  "identifier": "admin@medusa-test.com"
}'