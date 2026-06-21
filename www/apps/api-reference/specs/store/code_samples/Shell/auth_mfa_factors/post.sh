curl -X POST '{backend_url}/auth/mfa/factors' \
-H 'Content-Type: application/json' \
--data-raw '{
  "provider": "{value}"
}'