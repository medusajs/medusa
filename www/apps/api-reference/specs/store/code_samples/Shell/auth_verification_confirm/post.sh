curl -X POST '{backend_url}/auth/verification/confirm' \
-H 'Content-Type: application/json' \
--data-raw '{
  "code": "{value}"
}'