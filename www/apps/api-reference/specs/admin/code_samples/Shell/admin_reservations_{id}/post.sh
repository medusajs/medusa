curl -X POST '{backend_url}/admin/reservations/{id}' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "description": "{value}",
  "metadata": {}
}'