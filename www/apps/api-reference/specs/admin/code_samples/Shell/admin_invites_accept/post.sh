curl -X POST '{backend_url}/admin/invites/accept' \
-H 'Content-Type: application/json' \
--data-raw '{
  "email": "Lila_Zemlak@hotmail.com",
  "first_name": "{value}",
  "last_name": "{value}"
}'