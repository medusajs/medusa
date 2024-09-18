curl -X POST '{backend_url}/admin/refund-reasons' \
-H 'Authorization: Bearer {access_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "label": "{value}",
  "description": "{value}"
}'