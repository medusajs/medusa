curl -X POST '{backend_url}/admin/invites/accept?token={invite_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "email": "Lila_Zemlak@hotmail.com",
  "first_name": "{value}",
  "last_name": "{value}"
}'