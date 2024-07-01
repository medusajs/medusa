curl -X POST '{backend_url}/admin/api-keys' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "title": "{value}",
  "type": "{value}"
}'