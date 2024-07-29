curl -X POST '{backend_url}/admin/returns/{id}' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "metadata": {}
}'