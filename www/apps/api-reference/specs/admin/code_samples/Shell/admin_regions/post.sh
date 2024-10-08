curl -X POST '{backend_url}/admin/regions' \
-H 'Authorization: Bearer {access_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "name": "Heloise",
  "currency_code": "{value}",
  "metadata": {}
}'