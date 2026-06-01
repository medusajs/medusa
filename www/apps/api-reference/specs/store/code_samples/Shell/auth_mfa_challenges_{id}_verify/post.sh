curl -X POST '{backend_url}/auth/mfa/challenges/{id}/verify' \
-H 'Content-Type: application/json' \
--data-raw '{
  "method": "{value}",
  "code": "{value}"
}'