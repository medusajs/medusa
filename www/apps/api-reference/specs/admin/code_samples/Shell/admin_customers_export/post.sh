curl -X POST '{backend_url}/admin/customers/export' \
-H 'Authorization: Bearer {access_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "format": "json"
}'