curl -X POST '{backend_url}/admin/users/{id}' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "avatar_url": "{value}"
}'