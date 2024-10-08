curl -X POST '{backend_url}/admin/refund-reasons/{id}' \
-H 'Authorization: Bearer {access_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "description": "{value}"
}'