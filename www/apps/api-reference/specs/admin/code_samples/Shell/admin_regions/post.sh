curl -X POST '{backend_url}/admin/regions' \
-H 'x-medusa-access-token: {api_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "name": "Heloise",
  "currency_code": "{value}",
  "metadata": {}
}'