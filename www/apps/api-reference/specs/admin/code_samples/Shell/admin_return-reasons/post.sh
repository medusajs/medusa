curl -X POST '{backend_url}/admin/return-reasons' \
-H 'Authorization: Bearer {access_token}' \
-H 'Content-Type: application/json' \
--data-raw '{
  "value": "{value}",
  "label": "{value}"
}'