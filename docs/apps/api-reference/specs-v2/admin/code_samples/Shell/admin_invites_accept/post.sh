curl -X POST '{backend_url}/admin/invites/accept' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "first_name": "{value}",
  "last_name": "{value}"
}'