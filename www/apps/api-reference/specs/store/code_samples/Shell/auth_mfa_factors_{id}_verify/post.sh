curl -X POST '{backend_url}/auth/mfa/factors/{id}/verify' \
-H 'Content-Type: application/json' \
--data-raw '{
  "code": "{value}"
}'