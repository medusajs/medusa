curl -X POST '{backend_url}/admin/users/{id}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "first_name": "{value}",
  "last_name": "{value}",
  "avatar_url": "{value}"
}'