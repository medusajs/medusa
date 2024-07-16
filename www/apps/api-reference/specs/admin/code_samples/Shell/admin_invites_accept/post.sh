curl -X POST '{backend_url}/admin/invites/accept' \
-H 'Content-Type: application/json' \
--data-raw '{
  "email": "Jailyn.Runolfsdottir84@gmail.com",
  "first_name": "{value}",
  "last_name": "{value}"
}'