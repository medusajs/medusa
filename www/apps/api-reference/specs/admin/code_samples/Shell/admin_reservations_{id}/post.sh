curl -X POST '{backend_url}/admin/reservations/{id}' \
-H 'Authorization: Bearer {access_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "description": "{value}",
  "metadata": {}
}'