curl -X POST '{backend_url}/admin/api-keys' \
-H 'Authorization: Bearer {access_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "title": "{value}",
  "type": "{value}"
}'