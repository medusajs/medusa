curl -X POST '{backend_url}/auth/customer/emailpass/verification/confirm' \
-H 'Content-Type: application/json' \
--data-raw '{
  "token": "{value}"
}'